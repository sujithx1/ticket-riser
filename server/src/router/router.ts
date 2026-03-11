import {
  IssueAssigneesSchema,
  IssueCommentsSchema,
  IssueSchema,
  RoleSchema,
  UserSchema,
} from "@magadhtech/mds-schema";
import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Hono } from "hono";
import z from "zod";
import {
  DeleteComment,
  getDevelopers,
  PostComments,
  PuntComment,
} from "../controller/controller";
import { db } from "../db/db";
import { PrettierErorr } from "../helper";
import { authenticate, getAuthSession } from "../middleware/auth.middleware";

export const router = new Hono();

const CreateIssueSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required and must be at least 3 characters long"),
  description: z.string().optional(),
  priority_level: z.enum(["low", "medium", "high"]).default("low"),
  assignee: z.object({
    id: z.string().min(1, "Assignee is required"),
  }),
  attachments: z.array(z.string()).optional(),
});
const EditIssueSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority_level: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["open", "in_progress", "closed"]).optional(),
  attachments: z.array(z.string()).optional(),
});

router.use("*", authenticate);
router.post("/issue", async (c) => {
  const body = await c.req.json();
  const authUser = getAuthSession(c);
  const parsedBody = CreateIssueSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json({ message: PrettierErorr(parsedBody.error) }, 400);
  }
  const { title, description, priority_level, attachments, assignee } =
    parsedBody.data;

  await db.transaction(async (tx) => {
    const [data] = await tx
      .insert(IssueSchema)
      .values({
        description: description,
        title: title,
        priority: priority_level,
        attachments,
        createdBy: authUser.user.id,
      })
      .returning({
        id: IssueSchema.id,
      });

    await tx.insert(IssueAssigneesSchema).values({
      issueId: data.id,
      userId: assignee.id,
      assignedBy: authUser.user.id,
    });
  });

  return c.json({ message: "Issue created successfully" }, 201);
});

router.put("/issues/:id", async (c) => {
  const body = await c.req.json();
  const parsedBody = EditIssueSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json({ message: PrettierErorr(parsedBody.error) }, 400);
  }
  const { title, description, priority_level, status, attachments } =
    parsedBody.data;
  const { id } = c.req.param();
  if (!id) {
    return c.json({ message: "Issue id is required" }, 400);
  }

  await db
    .update(IssueSchema)
    .set({
      description: description,
      title: title,
      priority: priority_level,
      status,
      attachments,
      closedAt: status === "closed" ? new Date() : null,
    })
    .where(eq(IssueSchema.id, id));

  return c.json({ message: "Issue updated successfully" }, 200);
});

router.get("/issues", async (c) => {
  const issuecreater = alias(UserSchema, "issuecreater");
  const commentUser = alias(UserSchema, "commentUser");

  const data = await db
    .select({
      id: IssueSchema.id,
      title: IssueSchema.title,
      description: IssueSchema.description,
      priority: IssueSchema.priority,
      status: IssueSchema.status,
      attachments: IssueSchema.attachments,
      createdAt: IssueSchema.createdAt,
      closedAt: IssueSchema.closedAt,
      createdBy: sql`
json_build_object(
  'id', ${IssueSchema.createdBy},
  'name', min(${issuecreater.name})
)
`,
      comments: sql`
      COALESCE(
        json_agg(
          json_build_object(
            'id', ${IssueCommentsSchema.id},
            'comment', ${IssueCommentsSchema.comment},
            'commentType', ${IssueCommentsSchema.commentType},
            'attachments', ${IssueCommentsSchema.attachments},
            'createdAt', ${IssueCommentsSchema.createdAt},
            'metadata', ${IssueCommentsSchema.metadata},
            'user', json_build_object(
              'id', ${commentUser.id},
              'name', ${commentUser.name},
              'role', ${RoleSchema.name}
            )
              
          )
          ORDER BY ${IssueCommentsSchema.createdAt} ASC
        ) FILTER (WHERE ${IssueCommentsSchema.id} IS NOT NULL),
        '[]'
      )
    `,
    })
    .from(IssueSchema)
    .leftJoin(
      IssueCommentsSchema,
      eq(IssueSchema.id, IssueCommentsSchema.issueId),
    )
    .leftJoin(issuecreater, eq(issuecreater.id, IssueSchema.createdBy))

    .leftJoin(RoleSchema, eq(RoleSchema.id, issuecreater.role))
    .leftJoin(commentUser, eq(commentUser.id, IssueCommentsSchema.userId))
    .groupBy(IssueSchema.id)
    .orderBy(desc(IssueSchema.createdAt));

  return c.json(
    {
      data,
      message: "success",
    },
    200,
  );
});

router.get("/developers", getDevelopers);
router.post("/comment", PostComments);
router.put("/comment", PuntComment);
router.delete("/comment", DeleteComment);

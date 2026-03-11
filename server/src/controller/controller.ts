import {
  IssueCommentsSchema,
  IssueSchema,
  RoleSchema,
  UserSchema,
} from "@magadhtech/mds-schema";
import { eq, or } from "drizzle-orm";
import { Context } from "hono";
import z from "zod";
import { db } from "../db/db";
import { PrettierErorr } from "../helper";
import { getAuthSession } from "../middleware/auth.middleware";

export const getDevelopers = async (c: Context) => {
  const data = await db
    .select({
      name: UserSchema.name,
      role: {
        name: RoleSchema.name,
        id: RoleSchema.id,
      },
      id: UserSchema.id,
    })
    .from(UserSchema)
    .leftJoin(RoleSchema, eq(RoleSchema.id, UserSchema.role))
    .where(or(eq(RoleSchema.name, "DEVELOPER"), eq(RoleSchema.name, "ADMIN")));

  return c.json({ data, message: "success" }, 200);
};

const CreateCommentsSchema = z.object({
  issueId: z.string(),
  comment: z.string(),
  attachments: z
    .array(z.object({ url: z.string(), name: z.string() }))
    .optional(),
});

export const PostComments = async (c: Context) => {
  const body = await c.req.json();
  const authUser = getAuthSession(c);
  const parsedBody = CreateCommentsSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json({ message: PrettierErorr(parsedBody.error) }, 400);
  }
  const { issueId, comment, attachments } = parsedBody.data;

  const [existIssue] = await db
    .select({
      id: IssueSchema.id,
    })
    .from(IssueSchema)
    .where(eq(IssueSchema.id, issueId));

  if (!existIssue) {
    return c.json({ message: "Issue not found" }, 404);
  }

  const comment_type =
    authUser.user.role.name === "ADMIN" ||
    authUser.user.role.name === "DEVELOPER"
      ? "dev-team"
      : "user";

  const [inserted] = await db
    .insert(IssueCommentsSchema)
    .values({
      issueId,
      comment,
      attachments: attachments?.map((a) => a.url),
      commentType: comment_type,
      userId: authUser.user.id,
    })
    .returning({
      id: IssueCommentsSchema.id,
    });

    if(!inserted) {
      return c.json({ message: "Something went wrong" }, 500);
    }

  const [comments] = await db
    .select({
      id: IssueCommentsSchema.id,
      comment: IssueCommentsSchema.comment,
      commentType: IssueCommentsSchema.commentType,
      attachments: IssueCommentsSchema.attachments,
      createdAt: IssueCommentsSchema.createdAt,
      metadata: IssueCommentsSchema.metadata,
      // user: {
      //   id: UserSchema.id,
      //   name: UserSchema.name,
      //   role: {
      //     name: RoleSchema.name,
      //   },
      // },
    })
    .from(IssueCommentsSchema)
    .leftJoin(UserSchema, eq(UserSchema.id, IssueCommentsSchema.userId))
    .leftJoin(RoleSchema, eq(RoleSchema.id, UserSchema.role))
    .where(eq(IssueCommentsSchema.id, inserted.id));

    const res={
      id:comments.id,
      comment:comments.comment,
      commentType:comments.commentType,
      attachments:comments.attachments,
      createdAt:comments.createdAt,
      metadata:comments.metadata,
      user: {
        id: authUser.user.id,
        name: authUser.user.name,
        role: {
          name: authUser.user.role.name,
        },
      },
    }



  return c.json({ message: "success" ,data:res}, 201);
};

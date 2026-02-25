import {
  index,
  integer,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

//schema for issue tracker


export const task_schema= pgSchema("tasks");



/* ============================
	 ENUMS
============================ */

export const issueStatusEnum = task_schema.enum("issue_status", [
	"open",
	"in_progress",
	"closed",
]);

export const issuePriorityEnum = task_schema.enum("issue_priority", [
	"low",
	"medium",
	"high",
]);

export const commentTypeEnum = task_schema.enum("comment_type", [
	"user",
	"system",
]);

/* ============================
	 ISSUES
============================ */

export const issues = task_schema.table("issues", {
	id: uuid("id").primaryKey(),

	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),

	status: issueStatusEnum("status").default("open").notNull(),
	priority: issuePriorityEnum("priority").default("medium").notNull(),

	escalationLevel: integer("escalation_level").default(0).notNull(),

	createdBy: uuid("created_by").notNull(),

	attachments: jsonb("attachments").$type<string[] | null>(),

	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),

	closedAt: timestamp("closed_at", { withTimezone: true }),
});

/* ============================
	 ISSUE ASSIGNEES
============================ */

export const issueAssignees = task_schema.table(
	"issue_assignees",
	{
		issueId: uuid("issue_id").notNull(),
		userId: uuid("user_id").notNull(),

		assignedAt: timestamp("assigned_at", { withTimezone: true })
			.defaultNow()
			.notNull(),

		assignedBy: uuid("assigned_by").notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.issueId, table.userId] }),
		index("issue_assignees_user_idx").on(table.userId),
	]
);

/* ============================
	 ISSUE COMMENTS
============================ */

export const issueComments = task_schema.table(
	"issue_comments",
	{
		id: uuid("id").primaryKey(),

		issueId: uuid("issue_id").notNull(),
		userId: uuid("user_id").notNull(),

		comment: text("comment"),

		commentType: commentTypeEnum("comment_type")
			.default("user")
			.notNull(),

		metadata: jsonb("metadata").$type<Record<string, any> | null>(),

		attachments: jsonb("attachments").$type<string[] | null>(),

		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("issue_comments_issue_idx").on(table.issueId),
	]
);

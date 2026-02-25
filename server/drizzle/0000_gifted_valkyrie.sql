--> statement-breakpoint
CREATE TYPE "tasks"."comment_type" AS ENUM('user', 'system');--> statement-breakpoint
CREATE TYPE "tasks"."issue_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "tasks"."issue_status" AS ENUM('open', 'in_progress', 'closed');--> statement-breakpoint
CREATE TABLE "tasks"."issue_assignees" (
	"issue_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_by" uuid NOT NULL,
	CONSTRAINT "issue_assignees_issue_id_user_id_pk" PRIMARY KEY("issue_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "tasks"."issue_comments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"issue_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"comment" text,
	"comment_type" "tasks"."comment_type" DEFAULT 'user' NOT NULL,
	"metadata" jsonb,
	"attachments" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks"."issues" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "tasks"."issue_status" DEFAULT 'open' NOT NULL,
	"priority" "tasks"."issue_priority" DEFAULT 'medium' NOT NULL,
	"escalation_level" integer DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"attachments" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "issue_assignees_user_idx" ON "tasks"."issue_assignees" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "issue_comments_issue_idx" ON "tasks"."issue_comments" USING btree ("issue_id");
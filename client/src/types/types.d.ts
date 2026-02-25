import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { issues, issueComments, issueAssignees } from './schema'; // adjust path to your schema file

/* ============================
   DATABASE INFERRED TYPES
   ============================ */

// This is what you get back from a SELECT query
export type Issue = InferSelectModel<typeof issues>;
export type Comment = InferSelectModel<typeof issueComments>;
export type Assignee = InferSelectModel<typeof issueAssignees>;

// This is what you need for an INSERT (omits default values like createdAt)
export type NewIssue = InferInsertModel<typeof issues>;
export type NewComment = InferInsertModel<typeof issueComments>;

/* ============================
   FRONTEND UI TYPES
   ============================ */

// For your Priority Selector and Status Badges
export type IssuePriority = "low" | "medium" | "high";
export type IssueStatus = "open" | "in_progress" | "closed";

// The shape of the data Sujith creates in the CreateTicketDialog
export interface CreateTicketFormValues {
  title: string;
  description: string | null;
  priority: IssuePriority;
  status: IssueStatus;
  attachments: string[] | null;
}

// User Context for Sujith and other teammates
export interface TicketUser {
  id: string;
  name: string;
  role: 'Developer' | 'Admin' | 'Manager';
  avatarUrl?: string;
}

// A combined type for the "Everything Table" view (Issue + its Comments)
export type IssueWithDetails = Issue & {
  comments: Comment[];
  assignees: TicketUser[];
};
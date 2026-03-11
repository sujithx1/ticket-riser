/* ============================
   DATABASE INFERRED TYPES
   ============================ */

// This is what you get back from a SELECT query
/* ============================
FRONTEND UI TYPES
============================ */

{
  /* ============================
  1	id	uuid	NULL	NULL	NULL	NULL	NO	uuidv7()	 	
  2	issue_id	uuid	NULL	NULL	NULL	NULL	NO	NULL	 	
  3	user_id	uuid	NULL	NULL	NULL	NULL	NO	NULL	 	
  4	comment	text	NULL	NULL	NULL	NULL	YES	NULL	 	
  5	comment_type	comment_type	NULL	NULL	NULL	NULL	NO	'user'::ticket_rise.comment_type	 	
  6	metadata	jsonb	NULL	NULL	NULL	NULL	YES	NULL	 	
  7	attachments	jsonb	NULL	NULL	NULL	NULL	YES	NULL	 	
8	created_at	timestamptz	NULL	6	NULL	NULL	NO	now()	 	
	


============================ */
}

export type Comment = {
  id: string;
  issue_id: string;
  user: {
    id: string;
    name: string;
    role:string

  }
  comment: string | null;
  comment_type: string;
  metadata: string | null;
  attachments: {
    url: string;
    name: string;
  }[] | null;
  createdAt: Date;
};

export type Issue = {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  escalation_level: number;
  createdBy: {
    id: string;
    name: string;
    // role: {
    //   id: string;
    //   name: string;
    // };
  };
  attachments: string[] | null;
  createdAt: Date;
  closed_at: Date | null;
  comments: Comment[];
};

export type IssueAssignee = {
  issue_id: string;
  user: {
    id: string;
    name: string;
  };
  assigned_at: Date;
  assigned_by: {
    id: string;
    name: string;
  };
};

// For your Priority Selector and Status Badges
export type IssuePriority = "low" | "medium" | "high";
export type IssueStatus = "open" | "in_progress" | "closed";

// The shape of the data Sujith creates in the CreateTicketDialog
export interface CreateTicketFormValues {
  title: string;
  description: string | null;
  priority: IssuePriority;
  attachments: string[] | null;
  assignee: {
    name: string;
    id: string;
    role: {
      name: string;
      id: string;
    };
  };
}

// User Context for Sujith and other teammates
export interface TicketUser {
  id: string;
  name: string;
  role: "Developer" | "Admin" | "Manager";
  avatarUrl?: string;
}

// A combined type for the "Everything Table" view (Issue + its Comments)
export type IssueWithDetails = Issue & {
  comments: Comment[];
  assignees: TicketUser[];
};

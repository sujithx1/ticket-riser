import TicketDashboard from '@/components/TicketDashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App })
export const MOCK_ISSUES = [
  {
    id: "1",
    title: "Production Server Latency",
    description: "Users reporting 5s delays on login in the APAC region.",
    status: "in_progress",
    priority: "high",
    createdAt: new Date("2024-05-20T10:00:00"),
  },
  {
    id: "2",
    title: "Update Logo in Footer",
    description: "Marketing requested the new SVG logo for the main site footer.",
    status: "open",
    priority: "low",
    createdAt: new Date("2024-05-21T14:30:00"),
  },
  {
    id: "3",
    title: "DB Migration Script failing",
    description: "The migration to add 'metadata' column is hanging on local env.",
    status: "open",
    priority: "medium",
    createdAt: new Date("2024-05-22T09:15:00"),
  }
];
export const MOCK_COMMENTS: Record<string, any[]> = {
  "1": [
    {
      id: "c1",
      comment: "Ticket created and assigned to DevOps",
      commentType: "system", // No userName needed, handled by fallback
      createdAt: new Date("2024-05-20T10:05:00"),
    },
    {
      id: "c2",
      userName: "Sujith",
      userRole: "Developer",
      comment: "I've checked the CloudWatch logs. It seems like a cold start issue.",
      commentType: "user",
      attachments: ["logs_cloudwatch.txt"],
      createdAt: new Date("2024-05-20T10:45:00"),
    },
    {
      id: "c3",
      comment: "Priority changed from Medium to High",
      commentType: "system",
      createdAt: new Date("2024-05-20T11:00:00"),
    }
  ],
  "2": [
    {
      id: "c4",
      userName: "Sujith",
      userRole: "Developer",
      comment: "Waiting for SVG assets from the design team.",
      commentType: "user",
      createdAt: new Date("2024-05-21T15:00:00"),
    }
  ],
  "3": []
};
function App() {
 

  return (
    <>
    

   



<TicketDashboard initialIssues={MOCK_ISSUES} commentsData={MOCK_COMMENTS} />
    </>
   
  )
}

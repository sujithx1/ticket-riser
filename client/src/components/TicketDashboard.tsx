import { UsePostTicket } from "@/api/api";
import type { CreateTicketFormValues, Issue } from "@/types/types";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import CreateTicketDialog from "./CreateTicket";
import { TicketRow } from "./TicketRow";
// Import the types we created

// interface DashboardProps {
//   initialIssues: Issue[];
//   commentsData: Record<string, Comment[]>;
// }

export default function TicketDashboard({ initialIssues, commentsData }: any) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const postcreateticketMuntation = UsePostTicket();
  // Maintain local state for issues so Sujith's new tickets show up immediately
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  const handleNewTicket = (data: CreateTicketFormValues) => {
    // 1. Prepare the new issue object (matching Drizzle schema)
    // const newIssue = {
    // //   // id: crypto.randomUUID(),
    // //   title: data.title,
    // //   description: data.description,
    // //   // status: data.status,
    // //   priority: data.priority,
    // //   attachments: data.attachments,
    // //   // createdAt: new Date(),
    // //   // closedAt: null,
    // //   // escalationLevel: 0,
    // //   // createdBy: 'u-1', // Sujith's ID
    // // };

    // write api call

    postcreateticketMuntation.mutate(data, {
      onSuccess: (newdata) => {
        toast.success("Ticket created successfully");
        setIssues((prev) => [newdata, ...prev]);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    });

    // 2. Update the UI state

    // 3. Logic to call your API route would go here
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: { xs: 2, md: 4 } }}>
      {/* HEADER SECTION - ALIGNED */}
      <Stack
        direction="row"
        justifyContent="end"
        alignItems="flex-end"
        sx={{ mb: 4 }}
      >
        <Box>{/* Branding */}</Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            bgcolor: "#0ea5e9",
            borderRadius: "10px",
            px: 3,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#0284c7" },
          }}
        >
          New Uplink
        </Button>
      </Stack>

      {/* DATA TABLE */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell width="60px" />
              <TableCell
                sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.75rem" }}
              >
                UUID
              </TableCell>
              <TableCell
                sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.75rem" }}
              >
                SUBJECT_INTEL
              </TableCell>
              <TableCell
                sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.75rem" }}
              >
                PRIORITY
              </TableCell>
              <TableCell
                sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.75rem" }}
              >
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues && issues.length > 0 ? (
              issues.map((row) => (
                <TicketRow
                  key={row.id}
                  row={row}
                  initialComments={commentsData[row.id] || []}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography variant="body2" color="text.secondary">
                    No active uplinks found in database.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CREATE MODAL */}
      <CreateTicketDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleNewTicket}
      />
    </Box>
  );
}

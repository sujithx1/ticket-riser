import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import CreateTicketDialog from './CreateTicket';
import { TicketRow } from './TicketRow';

export default function TicketDashboard({ issues, commentsData }: any) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNewTicket = (data: any) => {
    console.log("Inserting into Drizzle:", data);
    // Add your db logic here
  };
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', p: 4 }}>

      <Button 
        variant="contained" 
        onClick={() => setDialogOpen(true)}
        sx={{ bgcolor: '#0ea5e9' }}
      >
        New Ticket
      </Button>
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px' }}>
          CONTROL_<span style={{ color: '#0ea5e9' }}>HUB</span>
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
          TICKET_SYSTEM_STATUS: ACTIVE // STACK: DRIZZLE_MUI_V6
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>UUID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>SUBJECT</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>PRIORITY</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
           
           issues&&
            issues.length>0&&
            issues.map((row: any) => (
              <TicketRow key={row.id} row={row} initialComments={commentsData[row.id]||[]}  />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateTicketDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onSubmit={handleNewTicket} 
      />
    </Box>
  );
}
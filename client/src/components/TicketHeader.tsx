import { Box, Typography, Breadcrumbs, Link, Chip } from '@mui/material';

export const TicketHeader = () => (
  <Box mb={4}>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, fontSize: '0.85rem' }}>
      <Link underline="hover" color="inherit" href="/">Dashboard</Link>
      <Typography color="text.primary">New Ticket</Typography>
    </Breadcrumbs>
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="h4" fontWeight="700">Raise Issue</Typography>
      <Chip label="Draft" variant="outlined" size="small" />
    </Box>
    <Typography color="text.secondary" mt={1}>
      Fill in the details below to log a new task in the system.
    </Typography>
  </Box>
);
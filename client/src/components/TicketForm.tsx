import SendIcon from '@mui/icons-material/Send';
import { Alert, Box, Button, Container, Divider, Paper } from '@mui/material';
import { useState, type SubmitEvent } from 'react';
import { AttachmentZone } from './AttachmentZone';
import { FormInputs } from './FormInputs';
import { TicketHeader } from './TicketHeader';

export default function CreateTicketPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    console.log("Ready for Drizzle Insert:", formData);
    // Logic to call your API route here
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <TicketHeader />
      
      <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <FormInputs formData={formData} onChange={handleFieldChange} />
          
          <AttachmentZone />

          <Divider sx={{ my: 4 }} />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="text" color="inherit">Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              endIcon={<SendIcon />}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Create Ticket
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
        Tickets created here will be assigned to the <strong>tasks.issues</strong> table.
      </Alert>
    </Container>
  );
}
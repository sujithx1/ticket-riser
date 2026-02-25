import { MenuItem, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid'; // Use Grid2 to avoid the "item" prop error

interface FormProps {
  formData: {
    title: string;
    description: string;
    status: string;
    priority: string;
  };
  onChange: (field: string, value: string) => void;
}

export const FormInputs = ({ formData, onChange }: FormProps) => (
  <Stack spacing={3}>
    <TextField
      fullWidth
      label="Issue Title"
      variant="outlined"
      placeholder="Briefly describe the problem"
      value={formData.title}
      onChange={(e) => onChange('title', e.target.value)}
      required
    />

    <TextField
      fullWidth
      label="Detailed Description"
      multiline
      rows={4}
      placeholder="Provide steps to reproduce or technical details..."
      value={formData.description}
      onChange={(e) => onChange('description', e.target.value)}
    />

    {/* In Grid2, you just specify the container spacing and size on the children */}
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          label="Initial Status"
          value={formData.status}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </TextField>
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          label="Priority Level"
          value={formData.priority}
          onChange={(e) => onChange('priority', e.target.value)}
        >
          <MenuItem value="low">Low Priority</MenuItem>
          <MenuItem value="medium">Medium Priority</MenuItem>
          <MenuItem value="high">High Priority</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  </Stack>
);
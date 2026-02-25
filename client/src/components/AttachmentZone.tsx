import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, IconButton, Paper, Typography } from '@mui/material';

export const AttachmentZone = () => (
  <Box mt={3}>
    <Typography variant="subtitle2" gutterBottom fontWeight="600">
      Attachments (Optional)
    </Typography>
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        textAlign: 'center',
        borderStyle: 'dashed',
        bgcolor: 'action.hover',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.selected' }
      }}
    >
      <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="body2">Click to upload or drag and drop files</Typography>
    </Paper>
    {/* Example of rendered attachments from jsonb */}
    <Box mt={1} display="flex" gap={1}>
      <Paper variant="outlined" sx={{ px: 1, py: 0.5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption">error_log.pdf</Typography>
        <IconButton size="small"><CloseIcon fontSize="inherit" /></IconButton>
      </Paper>
    </Box>
  </Box>
);
import AttachmentIcon from '@mui/icons-material/Attachment';
import { Box, Button, Stack, Typography } from '@mui/material';

export const ActionLog = ({ comments }: any) => (
  <Stack spacing={1} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
    <Typography variant="caption" sx={{ color: '#38bdf8', mb: 1 }}>{'>'} DISPATCH_LOGS</Typography>
    { 

      comments.length>0&&



    comments.map((c: any) => (
      <Box key={c.id} sx={{ py: 1, borderLeft: '2px solid rgba(255,255,255,0.1)', pl: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: '#e0e0e0' }}>{c.comment}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.4 }}>{new Date(c.createdAt).toLocaleTimeString()}</Typography>
        </Box>
        {
        
        c.length>0&&
        c.attachments?.map((file: string) => (
          <Button 
            key={file}
            startIcon={<AttachmentIcon />} 
            sx={{ color: '#38bdf8', fontSize: '10px', textTransform: 'none', mt: 1 }}
          >
            {file}
          </Button>
        ))}
      </Box>
    ))}
  </Stack>
);
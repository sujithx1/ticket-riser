import  { Box, Typography } from "@mui/material";

export const CommentThread = ({ comments }: { comments: any[] }) => (
  <Box display="flex" flexDirection="column" gap={3}>
    {
    comments.length>0&&
    comments.map((msg) => (
      <Box 
        key={msg.id}
        sx={{
          alignSelf: msg.commentType === 'system' ? 'center' : 'flex-start',
          maxWidth: '80%',
          p: 2,
          borderRadius: '16px',
          background: msg.commentType === 'system' 
            ? 'transparent' 
            : 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: msg.commentType === 'system' 
            ? 'none' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: msg.priority === 'high' ? '0 0 15px rgba(255, 23, 68, 0.2)' : 'none'
        }}
      >
        <Typography variant="body2" sx={{ color: msg.commentType === 'system' ? 'rgba(255,255,255,0.4)' : '#e0e0e0' }}>
          {msg.comment}
        </Typography>
        {msg.attachments?.length > 0 && (
          <Box mt={1} p={1} sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00e5ff' }} />
            <Typography variant="caption" sx={{ color: '#00e5ff' }}>{msg.attachments[0]}</Typography>
          </Box>
        )}
      </Box>
    ))}
  </Box>
);
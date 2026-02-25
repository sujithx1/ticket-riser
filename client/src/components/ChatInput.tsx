import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import { useState } from 'react';

export const CommentInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState('');

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', border: '1px solid #ccc' }}
      elevation={0}
    >
      <IconButton sx={{ p: '10px' }} aria-label="attach file">
        <AttachFileIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Add a comment or update..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton 
        color="primary" 
        sx={{ p: '10px' }} 
        onClick={() => { onSend(text); setText(''); }}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};
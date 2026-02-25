import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box, Button, Chip, Collapse, IconButton, Stack,
  TableCell, TableRow, TextField, Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Using Grid2 for stable layouts
import React, { useRef, useState } from 'react';

export const TicketRow = ({ row, initialComments }: any) => {
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  // Local state to manage comments for this specific row
  const [comments, setComments] = useState(initialComments || []);
  const [pendingFiles, setPendingFiles] = useState<{file: File, preview: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = { id: 'u-1', name: 'Sujith', role: 'Developer' };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file) 
      }));
      setPendingFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTransmit = () => {
    if (!newComment.trim() && pendingFiles.length === 0) return;

    // Simulate the object structure for your Drizzle 'issueComments' table
    const newEntry = {
      id: new Date().toISOString(),
      userName: currentUser.name,
      userRole: currentUser.role,
      comment: newComment,
      commentType: 'user',
    attachments: pendingFiles.map(f => ({ name: f.file.name, url: f.preview })),
      
      createdAt: new Date(),
    };

    // Update local state to show it working immediately
    setComments((prev: any) => [...prev, newEntry]);
    
    // Clear the form
    setNewComment("");
    setPendingFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <React.Fragment>
      {/* HEADER ROW */}
      <TableRow 
        onClick={() => setOpen(!open)} 
        sx={{ 
            cursor: 'pointer', 
            bgcolor: open ? '#f1f5f9' : 'inherit',
            '&:hover': { bgcolor: '#f8fafc' }
        }}
      >
        <TableCell>
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{row.id}</TableCell>
        <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
        <TableCell>
          <Chip 
            label={row.priority.toUpperCase()} 
            size="small" 
            sx={{ 
                fontWeight: 900, 
                fontSize: '10px',
                bgcolor: row.priority === 'high' ? '#fee2e2' : '#e0f2fe',
                color: row.priority === 'high' ? '#ef4444' : '#0ea5e9'
            }} 
          />
        </TableCell>
        <TableCell>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                {row.status.toUpperCase()}
            </Typography>
        </TableCell>
      </TableRow>

      {/* DETAIL COLLAPSE */}
      <TableRow>
        <TableCell sx={{ p: 0, borderBottom: open ? '1px solid #e2e8f0' : 'none' }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2, p: 3, border: '1px solid #e2e8f0', borderRadius: '16px', bgcolor: '#fff' }}>
              <Grid container spacing={4}>
                {/* TECHNICAL DATA */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="overline" color="primary" fontWeight={900}>Technical Brief</Typography>
                  <Typography variant="body2" sx={{ color: '#475569', mt: 1, lineHeight: 1.6 }}>
                    {row.description}
                  </Typography>
                  
                  <Box mt={3}>
                    <Typography variant="overline" color="text.secondary">Asset Manifest</Typography>
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {(row.attachments || []).map((file: string) => (
                            <Chip key={file} label={file} size="small" variant="outlined" icon={<FilePresentIcon />} />
                        ))}
                    </Stack>
                  </Box>
                </Grid>

                {/* LOGS & INPUT */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="overline" color="primary" fontWeight={900}>Transmission Log</Typography>
                  
                  <Box sx={{ mt: 1, maxHeight: '300px', overflowY: 'auto', bgcolor: '#f8fafc', p: 2, borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    {comments.length > 0 ? comments.map((c: any) => (
                      <Box key={c.id} sx={{ mb: 2, p: 1.5, bgcolor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '10px', bgcolor: c.userName ? '#0ea5e9' : '#94a3b8' }}>
                            {(c.userName || 'S')[0]}
                          </Avatar>
                          <Typography variant="caption" fontWeight={800}>{c.userName ?? 'SYSTEM'}</Typography>
                          {c.userRole && <Chip label={c.userRole} size="small" sx={{ height: 14, fontSize: '8px', bgcolor: '#f1f5f9' }} />}
                          <Typography variant="caption" sx={{ ml: 'auto', color: '#94a3b8' }}>
                            {new Date(c.createdAt).toLocaleTimeString()}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#334155', ml: 4 }}>{c.comment}</Typography>
                        {c.attachments?.length > 0 && (
  <Stack direction="row" spacing={1} mt={1} ml={4}>
    {c.attachments.map((file: any,i:number) => (
      <Box key={i} sx={{ mt: 1 }}>
        {/* If it has a URL (newly sent), show the image. If just a name (mock data), show icon */}
        {file.url ? (
          <img src={file.url} style={{ width: 100, borderRadius: 4, border: '1px solid #ddd' }} />
        ) : (
          <Typography variant="caption" color="primary">
            <FilePresentIcon sx={{ fontSize: 12, mr: 0.5 }} /> {file.name || file}
          </Typography>
        )}
      </Box>
    ))}
  </Stack>
)}
                      </Box>
                    )) : (
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', py: 4 }}>
                            No logs recorded for this entry.
                        </Typography>
                    )}
                  </Box>

                  {/* INPUT ZONE */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    {/* IMAGE PREVIEW */}
                    {pendingFiles.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {pendingFiles.map((pf, idx) => (
                          <Box key={idx} sx={{ position: 'relative', width: 50, height: 50 }}>
                            <img src={pf.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                            <IconButton 
                              size="small" 
                              onClick={() => removeFile(idx)}
                              sx={{ position: 'absolute', top: -5, right: -5, bgcolor: '#ef4444', color: '#fff', padding: '2px', '&:hover': { bgcolor: '#dc2626' } }}
                            >
                              <CancelIcon sx={{ fontSize: 12 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    )}

                    <TextField 
                      fullWidth multiline rows={2} variant="standard" 
                      placeholder="Add system update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      InputProps={{ disableUnderline: true, sx: { fontSize: '14px' } }}
                    />
                    <Stack direction="row" justifyContent="space-between" mt={1}>
                      <IconButton size="small" onClick={() => fileInputRef.current?.click()}>
                        <AttachFileIcon fontSize="small" />
                        <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                      </IconButton>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={handleTransmit} 
                        endIcon={<SendIcon sx={{ fontSize: 14 }} />}
                        sx={{ bgcolor: '#0ea5e9', textTransform: 'none', px: 3, fontWeight: 700 }}
                      >
                        Transmit
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
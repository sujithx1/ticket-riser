import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import React, { useRef, useState } from 'react';

export default function CreateTicketDialog({ open, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  
  // File Preview State
  const [pendingFiles, setPendingFiles] = useState<{file: File, preview: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Context
  const currentUser = { name: 'Sujith', role: 'Developer' };

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

  const handleFormSubmit = () => {
    if (!formData.title) return;

    const finalData = {
      ...formData,
      attachments: pendingFiles.map(f => f.file.name),
      author: currentUser.name,
      createdAt: new Date(),
    };

    onSubmit(finalData);
    setPendingFiles([]);
    setFormData({ title: '', description: '', priority: 'medium' });
    onClose();
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: '24px', p: 1, border: '1px solid #e2e8f0', bgcolor: '#fff' }
      }}
    >
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
            NEW_ISSUE_<span style={{ color: '#0ea5e9' }}>UPLINK</span>
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
            <Avatar sx={{ width: 18, height: 18, bgcolor: '#0ea5e9', fontSize: '10px' }}>S</Avatar>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
              OPERATOR: {currentUser.name} // {currentUser.role}
            </Typography>
          </Stack>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <Divider sx={{ borderStyle: 'dashed', mx: 3 }} />

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Title Input */}
          <TextField
            fullWidth
            label="SUBJECT_LINE"
            placeholder="What is the anomaly?"
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="INTEL_DESCRIPTION"
            placeholder="Provide technical details..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
<Box>
  <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', mb: 1, display: 'block' }}>
    PRIORITY_LEVEL
  </Typography>
  <ToggleButtonGroup
    value={formData.priority}
    exclusive
    onChange={(e, nextValue) => {
      if (nextValue !== null) handleFieldChange('priority', nextValue);
    }}
    fullWidth
    sx={{ 
      height: '40px',
      '& .MuiToggleButton-root': {
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        textTransform: 'none',
        fontWeight: 700,
        color: '#64748b',
        '&.Mui-selected': {
          bgcolor: formData.priority === 'high' ? '#fee2e2' : 
                   formData.priority === 'medium' ? '#e0f2fe' : '#f0fdf4',
          color: formData.priority === 'high' ? '#ef4444' : 
                 formData.priority === 'medium' ? '#0ea5e9' : '#22c55e',
          borderColor: 'transparent',
          '&:hover': { opacity: 0.8 }
        }
      }
    }}
  >
    <ToggleButton value="low">Low</ToggleButton>
    <ToggleButton value="medium">Medium</ToggleButton>
    <ToggleButton value="high">High</ToggleButton>
  </ToggleButtonGroup>
</Box>
          {/* File Uplink Area */}
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', mb: 1, display: 'block' }}>
              ATTACH_ASSETS
            </Typography>
            
            {/* Image Preview Gallery */}
            {pendingFiles.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {pendingFiles.map((pf, idx) => (
                  <Box key={idx} sx={{ position: 'relative', width: 64, height: 64 }}>
                    <img 
                      src={pf.preview} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => removeFile(idx)}
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#ef4444', color: '#fff', p: 0.2, '&:hover': { bgcolor: '#dc2626' } }}
                    >
                      <CancelIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}

            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ borderRadius: '8px', textTransform: 'none', borderColor: '#cbd5e1', color: '#64748b' }}
            >
              Add Files
            </Button>
            <input 
              type="file" 
              multiple 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: '#94a3b8', fontWeight: 700 }}>Abort</Button>
        <Button 
          variant="contained" 
          onClick={handleFormSubmit}
          disabled={!formData.title}
          endIcon={<SendIcon />}
          sx={{ bgcolor: '#0ea5e9', borderRadius: '12px', px: 4, fontWeight: 700, textTransform: 'none' }}
        >
          Transmit Intel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
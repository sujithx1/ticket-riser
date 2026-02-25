import { ListItemButton, Typography, Box, Chip } from '@mui/material';

export const TicketListItem = ({ issue, isSelected, onSelect }: any) => {
  const glowColor = issue.priority === 'high' ? '#ff1744' : '#00e5ff';

  return (
    <ListItemButton
      onClick={() => onSelect(issue.id)}
      sx={{
        mx: 1, my: 1,
        borderRadius: '12px',
        transition: '0.3s',
        background: isSelected 
          ? 'linear-gradient(90deg, rgba(0,229,255,0.1) 0%, rgba(0,0,0,0) 100%)' 
          : 'transparent',
        borderLeft: isSelected ? `4px solid ${glowColor}` : '4px solid transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>
            #{issue.id.slice(0, 8)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            12m ago
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#fff', fontWeight: isSelected ? 700 : 400 }}>
          {issue.title}
        </Typography>
        <Box mt={1} display="flex" gap={1}>
          <Chip 
            label={issue.priority.toUpperCase()} 
            size="small" 
            sx={{ 
              height: '16px', fontSize: '10px', 
              bgcolor: isSelected ? glowColor : 'rgba(255,255,255,0.1)',
              color: '#fff', fontWeight: 'bold'
            }} 
          />
        </Box>
      </Box>
    </ListItemButton>
  );
};
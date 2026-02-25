import {
  Box,
  Chip,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from '@mui/material';

export const TicketTable = ({ issues, onSelect }: any) => {
  return (
    <TableContainer component={Box} sx={{ bgcolor: 'transparent' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ borderBottom: '2px solid rgba(56, 189, 248, 0.3)' }}>
            <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold' }}>ENTRY_ID</TableCell>
            <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold' }}>SUBJECT</TableCell>
            <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold' }}>PRIORITY</TableCell>
            <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold' }}>STATUS</TableCell>
            <TableCell sx={{ color: '#38bdf8', fontWeight: 'bold' }}>TIMESTAMP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
          issues.length>0&&
          issues.map((row: any) => (
            <TableRow 
              key={row.id}
              onClick={() => onSelect(row.id)}
              sx={{ 
                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.05)', cursor: 'pointer' },
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <TableCell sx={{ color: '#0ea5e9', fontFamily: 'monospace' }}>
                {row.id.slice(0, 8)}
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 500 }}>{row.title}</TableCell>
              <TableCell>
                <Chip 
                  label={row.priority} 
                  size="small"
                  sx={{ 
                    bgcolor: row.priority === 'high' ? 'rgba(255, 23, 68, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                    color: row.priority === 'high' ? '#ff1744' : '#38bdf8',
                    border: `1px solid ${row.priority === 'high' ? '#ff1744' : '#38bdf8'}`,
                    borderRadius: '4px',
                    fontSize: '10px'
                  }} 
                />
              </TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{row.status}</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                {new Date(row.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
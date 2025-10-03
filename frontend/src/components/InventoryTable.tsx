// InventoryTable.tsx

import React from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Box
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export type StockStatus = 'Normal' | 'Low' | 'Critical';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  weeklySales: number;
  remainingDays: number;
  status: StockStatus;
}

interface InventoryTableProps {
  products: Product[];
}

const getStatusChip = (status: StockStatus) => {
  let colorMap;

  // Define cores personalizadas para o background e texto do Chip
  switch (status) {
    case 'Normal':
      colorMap = {
        bgColor: '#e8f5e9', // Verde muito claro (semelhante ao success light)
        textColor: '#2e7d32', // Verde escuro (semelhante ao success main)
        Icon: CheckCircleOutlineIcon,
      };
      break;
    case 'Low':
      colorMap = {
        bgColor: '#fff8e1', // Amarelo muito claro (semelhante ao warning light)
        textColor: '#f9a825', // Laranja amarelado (semelhante ao warning main)
        Icon: ErrorOutlineIcon,
      };
      break;
    case 'Critical':
      colorMap = {
        bgColor: '#ffebee', // Vermelho muito claro (semelhante ao error light)
        textColor: '#d32f2f', // Vermelho escuro (semelhante ao error main)
        Icon: ReportProblemIcon,
      };
      break;
    default:
      colorMap = {
        bgColor: '#f5f5f5',
        textColor: '#616161',
        Icon: Box,
      };
  }
  
  const IconComponent = colorMap.Icon;

  return (
    <Chip 
      label={status} 
      size="small" 
      variant="filled" 
      icon={<IconComponent sx={{ fontSize: 16, color: colorMap.textColor + ' !important' }} />}
      sx={{
        backgroundColor: colorMap.bgColor,
        color: colorMap.textColor,
        fontWeight: 'bold',
        fontSize: '0.7rem',
        padding: '0 4px',
        '& .MuiChip-icon': {
            color: colorMap.textColor,
        }
      }}
    />
  );
};

const getDaysStyle = (days: number): React.CSSProperties => {
  if (days <= 15) return { color: '#f44336', fontWeight: 'bold', fontSize: "0.8rem", py: 0.6 };
  if (days <= 30) return { color: '#ff9800', fontWeight: 'bold', fontSize: "0.8rem", py: 0.6 };
  return { color: '#4caf50', fontSize: "0.8rem", py: 0.6 };
};

const headCells = [
  { id: 'product', label: 'Product' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'minStock', label: 'Min Stock' },
  { id: 'weeklySales', label: 'Weekly Sales' },
  { id: 'remainingDays', label: 'Days Remaining' },
  { id: 'status', label: 'Status' },
];


const InventoryTable: React.FC<InventoryTableProps> = ({ products }) => (
  <TableContainer component={Paper} elevation={1} sx={{ borderRadius: "1%", boxShadow: "none", border: "1px solid #e0e0e0",  }}>
    <Table aria-label="inventory table">
      <TableHead>
        <TableRow sx={{ backgroundColor: '#fff' }}>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} sx={{ fontWeight: 'bold', color: "#65758b", fontSize: "0.8rem" }}>
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((row) => (
          <TableRow
            key={row.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row" sx={{ fontSize: "0.8rem", py: 0.6}}>
              {row.name}
            </TableCell>
            <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>{row.quantity}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>{row.minStock}</TableCell>
            <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>{row.weeklySales}/wk</TableCell>
            <TableCell sx={getDaysStyle(row.remainingDays)}>
              {row.remainingDays} days
            </TableCell>
            <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>
              {getStatusChip(row.status)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default InventoryTable;
import React, { useState } from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Box, TableSortLabel
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export type StockStatus = 'Normal' | 'Low' | 'Critical';

export interface Product {
  product_no: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface InventoryTableProps {
  products: Product[];
}

type Order = 'asc' | 'desc';

const getStockStatus = (quantity: number): StockStatus => {
  if (quantity < 20) return 'Critical';
  if (quantity < 50) return 'Low';
  return 'Normal';
};

const getStatusChip = (quantity: number) => {
  const status = getStockStatus(quantity);
  let colorMap;

  switch (status) {
    case 'Normal':
      colorMap = {
        bgColor: '#e8f5e9',
        textColor: '#2e7d32',
        Icon: CheckCircleOutlineIcon,
      };
      break;
    case 'Low':
      colorMap = {
        bgColor: '#fff8e1',
        textColor: '#f9a825',
        Icon: ErrorOutlineIcon,
      };
      break;
    case 'Critical':
      colorMap = {
        bgColor: '#ffebee',
        textColor: '#d32f2f',
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

const headCells = [
  { id: 'product_no', label: 'Código do Produto', sortable: false },
  { id: 'product_name', label: 'Nome do Produto', sortable: false },
  { id: 'quantity', label: 'Quantidade', sortable: true },
  { id: 'price', label: 'Preço ($)', sortable: false },
  { id: 'status', label: 'Status', sortable: false },
];

const InventoryTable: React.FC<InventoryTableProps> = ({ products }) => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<string>('quantity');

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedProducts = React.useMemo(() => {
    const comparator = (a: Product, b: Product) => {
      if (orderBy === 'quantity') {
        return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
      }
      return 0;
    };

    return [...products].sort(comparator);
  }, [products, order, orderBy]);

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: "1%", boxShadow: "none", border: "1px solid #e0e0e0" }}>
      <Table aria-label="inventory table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#fff' }}>
            {headCells.map((headCell) => (
              <TableCell key={headCell.id} sx={{ fontWeight: 'bold', color: "#65758b", fontSize: "0.8rem" }}>
                {headCell.sortable ? (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                ) : (
                  headCell.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProducts.map((row) => (
            <TableRow
              key={row.product_no}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ fontSize: "0.8rem", py: 0.6 }}>
                {row.product_no}
              </TableCell>
              <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>{row.product_name}</TableCell>
              <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>{row.quantity}</TableCell>
              <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>
                {row.price.toFixed(2)}
              </TableCell>
              <TableCell sx={{ fontSize: "0.8rem", py: 0.6 }}>
                {getStatusChip(row.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
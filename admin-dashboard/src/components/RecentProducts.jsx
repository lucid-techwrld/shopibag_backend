import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import formatPrice from '../utils/formatPrice'; // Import the utility function

const RecentProducts = ({ products, onProductClick, loading }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Recent Products
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={product._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e3f2fd',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#bbdefb' },
                  }}
                  onClick={() => onProductClick(product)}
                >
                  <TableCell>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: 50, height: 50, borderRadius: 4 }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${formatPrice(product.price)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RecentProducts;
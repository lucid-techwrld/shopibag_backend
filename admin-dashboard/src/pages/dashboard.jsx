import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import SummaryCard from '../components/SummaryCard';
import RecentProducts from '../components/RecentProducts';
import InventoryWarnings from '../components/InventoryWarnings';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [totalStocks, setTotalStocks] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();

  const fetchTotalStock = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/products/stocks');

      if (!res.ok) {
        throw Error('Something went wrong, please try again!');
      }

      const data = await res.json();
      if (!data.success) {
        throw Error(data.msg || 'Something went wrong, please try again!');
      }
      console.log(data)
      setTotalStocks(data.totalQuantity);
    } catch (error) {
      console.error(error.msg || 'Failed to fetch total stock');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/products/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();

      // Sort products by createdAt or updatedAt (descending order)
      const sortedProducts = data.products.sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );

      // Get the most recent 5 products
      setRecentProducts(sortedProducts.slice(0, 5));

      // Filter products with stock < 5 for inventory warnings
      setLowStockProducts(sortedProducts.filter((product) => product.quantity < 5));
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  useEffect(() => {
    fetchTotalStock();
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    console.log('Clicked product:', product);
    // Open product details or edit modal
  };

  const handleRestock = (product) => {
    console.log('Restock product:', product);
    // Implement restock logic
  };

  const handleEdit = (product) => {
    console.log('Edit product:', product);
    // Open edit modal
  };

  const handleViewAllProducts = () => {
    navigate('/products'); // Navigate to the "All Products" page
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Total Products */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Products"
            value={totalStocks}
            icon={<InventoryIcon />}
            color="#1976d2"
          />
        </Grid>

        {/* Low Stock Items */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<InventoryIcon fontSize="large" />}
            title="Low Stock Items"
            value={lowStockProducts.length}
            color="#d32f2f"
          />
        </Grid>

        {/* Total Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<AttachMoneyIcon fontSize="large" />}
            title="Total Sales"
            value="$3,450"
            color="#2e7d32"
          />
        </Grid>

        {/* Total Users */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<PeopleIcon fontSize="large" />}
            title="Total Users"
            value="76"
            color="#f9a825"
          />
        </Grid>
      </Grid>

      {/* Recent Products Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          Recent Products
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleViewAllProducts}>
          View All Products
        </Button>
      </Box>
      <RecentProducts products={recentProducts} onProductClick={handleProductClick} loading={loading} />

      {/* Inventory Warnings Section */}
      <InventoryWarnings
        lowStockProducts={lowStockProducts}
        onRestock={handleRestock}
        onEdit={handleEdit}
      />
    </Box>
  );
};

export default Dashboard;
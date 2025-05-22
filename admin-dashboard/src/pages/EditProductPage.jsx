import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProductPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/products/${id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await res.json();
        setProductDetails(data.product);
      } catch (error) {
        console.error("Error fetching product:", error.message);
        toast.error("Failed to load product details.", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/products/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(productDetails),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      toast.success("Product updated successfully!", { position: "top-right" });
      navigate("/products"); // Redirect to product list
    } catch (error) {
      console.error("Error updating product:", error.message);
      toast.error("Failed to update product. Please try again.", {
        position: "top-right",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!productDetails) {
    return (
      <Typography variant="h6" color="error" textAlign="center">
        Product not found.
      </Typography>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" fontWeight="bold" textAlign="center">
        Edit Product
      </Typography>

      <TextField
        label="Product Name"
        value={productDetails.name}
        onChange={(e) =>
          setProductDetails({ ...productDetails, name: e.target.value })
        }
        required
        fullWidth
      />
      <TextField
        label="Description"
        value={productDetails.description}
        onChange={(e) =>
          setProductDetails({ ...productDetails, description: e.target.value })
        }
        multiline
        rows={3}
        fullWidth
      />
      <TextField
        label="Price"
        type="number"
        value={productDetails.price}
        onChange={(e) =>
          setProductDetails({ ...productDetails, price: e.target.value })
        }
        required
        fullWidth
      />
      <TextField
        label="Quantity"
        type="number"
        value={productDetails.quantity}
        onChange={(e) =>
          setProductDetails({ ...productDetails, quantity: e.target.value })
        }
        required
        fullWidth
      />
      <TextField
        label="Category"
        select
        value={productDetails.category}
        onChange={(e) =>
          setProductDetails({ ...productDetails, category: e.target.value })
        }
        fullWidth
      >
        <MenuItem value="men">Men</MenuItem>
        <MenuItem value="women">Women</MenuItem>
        <MenuItem value="kids">Kids</MenuItem>
        <MenuItem value="shoes">Foot Wear</MenuItem>
        <MenuItem value="nightwears">Night Wears</MenuItem>
        <MenuItem value="accessories">Accessories</MenuItem>
        <MenuItem value="bags">Bags</MenuItem>
      </TextField>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Update Product
      </Button>
    </Box>
  );
};

export default EditProductPage;

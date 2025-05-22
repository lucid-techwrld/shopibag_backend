import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  LinearProgress,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";

const AddProductForm = ({ onProductAdded }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "men",
  });
  const [loading, setLoading] = useState(false); // Spinner state

  const resetForm = () => {
    setProductDetails({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "men",
    });
    setUploadedImageUrl(null);
    setUploadProgress(0);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true); // Show spinner
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/image/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${errText}`);
      }

      const data = await res.json();
      setUploadedImageUrl(data.publicUrl);
      toast.success("Image uploaded successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Upload Error:", error.message);
      toast.error("Failed to upload image. Please try again.", {
        position: "top-right",
      });
      resetForm(); // Reset the form on failure
    } finally {
      setLoading(false); // Hide spinner
      setUploadProgress(0); // Reset progress bar
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedImageUrl) {
      toast.error("Please upload an image first.", { position: "top-right" });
      resetForm(); // Reset the form if no image is uploaded
      return;
    }

    const product = { ...productDetails, imageUrl: uploadedImageUrl };

    try {
      setLoading(true); // Show spinner
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/products/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${errText}`);
      }

      toast.success("Product added successfully!", { position: "top-right" });
      resetForm(); // Reset the form on success
      onProductAdded(); // Notify parent component
    } catch (error) {
      console.error("Error uploading product:", error.message);
      toast.error("Failed to add product. Please try again.", {
        position: "top-right",
      });
      resetForm(); // Reset the form on failure
    } finally {
      setLoading(false); // Hide spinner
    }
  };

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
        Add Product
      </Typography>

      {/* Drag-and-Drop Field */}
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          border: "2px dashed #1976d2",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          position: "relative",
        }}
      >
        {!uploadedImageUrl ? (
          <>
            <CloudUploadIcon sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography variant="body1" color="text.secondary">
              Drag and drop an image here, or click to upload
            </Typography>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setUploadProgress(30); // Simulate progress
                handleImageUpload(file);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </>
        ) : (
          <Box sx={{ position: "relative", textAlign: "center" }}>
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
            />
            <IconButton
              onClick={() => setUploadedImageUrl(null)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#fff",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <CancelIcon color="error" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Progress Bar */}
      {uploadProgress > 0 && (
        <LinearProgress variant="determinate" value={uploadProgress} />
      )}

      {/* Product Fields */}
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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#fff" }} />
        ) : (
          "Add Product"
        )}
      </Button>
    </Box>
  );
};

export default AddProductForm;

import React from 'react';
import AddProductForm from '../components/AddProductForm';

const AddProductPage = () => {
  const handleProductAdded = () => {
    console.log('Product added successfully!');
    // Additional logic after product is added (e.g., redirect or refresh)
  };

  return (
    <div>
      <h1>Add a Product</h1>
      <AddProductForm onProductAdded={handleProductAdded} />
    </div>
  );
};

export default AddProductPage;
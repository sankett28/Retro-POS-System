'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { validateProduct, validateBarcode } from '@/lib/utils/validators';

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [product, setProduct] = useState<Product>(() =>
    initialData
      ? initialData
      : {
          barcode: '',
          name: '',
          category: '',
          price: 0,
          cost: 0,
          stock: 0,
        }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    } else {
      setProduct({
        barcode: '',
        name: '',
        category: '',
        price: 0,
        cost: 0,
        stock: 0,
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [id]: id === 'price' || id === 'cost' ? parseFloat(value) : id === 'stock' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validateBarcode(product.barcode)) {
        newErrors.barcode = "Invalid barcode format. Must be at least 4 alphanumeric characters.";
    }
    if (product.name.trim() === '') {
        newErrors.name = "Product name is required.";
    }
    if (product.category.trim() === '') {
        newErrors.category = "Category is required.";
    }
    if (product.price <= 0) {
        newErrors.price = "Price must be greater than 0.";
    }
    if (product.stock < 0) {
        newErrors.stock = "Stock cannot be negative.";
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <Input
        label="Barcode"
        id="barcode"
        type="text"
        value={product.barcode}
        onChange={handleChange}
        required
        readOnly={!!initialData} // Barcode is read-only when editing
      />
      <Input
        label="Product Name"
        id="name"
        type="text"
        value={product.name}
        onChange={handleChange}
        required
      />
      <div className="form-group">
        <label htmlFor="category" className="block mb-2 font-semibold">Category</label>
        <select
          id="category"
          value={product.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border-border border-border-width rounded-md text-base bg-white font-medium focus:outline-none focus:border-primary focus:shadow-primary-glow"
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Beverages">Beverages</option>
          <option value="Home">Home & Garden</option>
          <option value="Health">Health & Beauty</option>
          <option value="Sports">Sports & Outdoors</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>
      <div className="form-row grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={product.price}
          onChange={handleChange}
          required
        />
        <Input
          label="Cost ($)"
          id="cost"
          type="number"
          step="0.01"
          min="0"
          value={product.cost}
          onChange={handleChange}
        />
      </div>
      <Input
        label="Stock Quantity"
        id="stock"
        type="number"
        min="0"
        value={product.stock}
        onChange={handleChange}
        required
      />
      <div className="form-actions flex justify-end space-x-4 mt-8">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Product
        </Button>
      </div>
    </form>
  );
}


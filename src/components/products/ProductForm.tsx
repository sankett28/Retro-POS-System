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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="barcode">Barcode</label>
        <input
          id="barcode"
          type="text"
          value={product.barcode}
          onChange={handleChange}
          required
          readOnly={!!initialData}
        />
        {errors.barcode && <p className="text-red-500 text-sm mt-1">{errors.barcode}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          type="text"
          value={product.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={product.category}
          onChange={handleChange}
          required
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
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={product.price}
            onChange={handleChange}
            required
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="cost">Cost ($)</label>
          <input
            id="cost"
            type="number"
            step="0.01"
            min="0"
            value={product.cost}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="stock">Stock Quantity</label>
        <input
          id="stock"
          type="number"
          min="0"
          value={product.stock}
          onChange={handleChange}
          required
        />
        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
      </div>
      <div className="form-actions">
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


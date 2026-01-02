'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import { validateProduct, validateBarcode } from '@/lib/utils/validators';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  initialData,
}: ProductModalProps) {
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
      [id]: id === 'price' || id === 'cost'
        ? (isNaN(parseFloat(value)) ? 0 : parseFloat(value))
        : id === 'stock'
        ? (isNaN(parseInt(value)) ? 0 : parseInt(value))
        : value,
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

    // Call the original onSubmit from props
    // onSubmit(product);
    // For now, directly handle logic or pass to parent through context/props
    console.log('Submitting product:', product);
    onClose(); // Close after submission for now
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} id="product-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">{initialData ? 'Edit Product' : 'Add Product'}</h2>
          <Button variant="icon" onClick={onClose} Icon={X} />
        </div>
        <form onSubmit={handleSubmit} id="product-form">
          <div className="form-group">
            <label htmlFor="product-barcode">Barcode</label>
            <input
              type="text"
              id="product-barcode"
              value={product.barcode}
              onChange={handleChange}
              required
              readOnly={!!initialData}
            />
            {errors.barcode && <p className="text-red-500 text-sm mt-1">{errors.barcode}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="product-name">Product Name</label>
            <input
              type="text"
              id="product-name"
              value={product.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="product-category">Category</label>
            <select
              id="product-category"
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
              <label htmlFor="product-price">Price ($)</label>
              <input
                type="number"
                id="product-price"
                step="0.01"
                min="0"
                value={product.price}
                onChange={handleChange}
                required
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="product-cost">Cost ($)</label>
              <input
                type="number"
                id="product-cost"
                step="0.01"
                min="0"
                value={product.cost}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="product-stock">Stock Quantity</label>
            <input
              type="number"
              id="product-stock"
              min="0"
              value={product.stock}
              onChange={handleChange}
              required
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

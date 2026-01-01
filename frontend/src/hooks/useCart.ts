import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { calculateSubtotal, calculateTax, calculateTotal } from '@/lib/utils/calculations';

export function useCart() {
  const { cart, products, addToCart, updateCartQuantity, removeFromCart, clearCart } = useApp();

  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  const handleAddToCart = (product: Product) => {
    const stockProduct = products.find(p => p.barcode === product.barcode);
    if (stockProduct && stockProduct.stock > 0) {
      addToCart(product);
    } else {
      alert('Product is out of stock!');
    }
  };

  return {
    cart,
    subtotal,
    tax,
    total,
    addToCart: handleAddToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };
}


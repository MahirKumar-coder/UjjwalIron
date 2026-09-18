'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ujjwal_iron_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('ujjwal_iron_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Helper to extract numeric kg from weight string
  const parseNumericWeight = (weightStr) => {
    if (!weightStr) return 0;
    const match = weightStr.match(/([0-9]+(\.[0-9]+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Add Item to Cart
  const addToCart = (product, sizeVariant, quantity = 10) => {
    const size = sizeVariant?.size || 'Standard Size';
    const weight = sizeVariant?.weight || product.weightPerUnit || '';
    const unitKg = parseNumericWeight(weight);
    const qty = Math.max(1, Number(quantity) || 1);
    const totalKg = unitKg > 0 ? parseFloat((unitKg * qty).toFixed(2)) : 0;
    
    // Unique ID combining product and size configuration
    const itemId = `${product._id || product.name}_${size}_${weight}`.replace(/[^a-zA-Z0-9_-]/g, '_');

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === itemId);
      if (existingIdx >= 0) {
        const updated = [...prevCart];
        const newQty = updated[existingIdx].quantity + qty;
        const newTotalKg = unitKg > 0 ? parseFloat((unitKg * newQty).toFixed(2)) : 0;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalWeightKg: newTotalKg,
        };
        return updated;
      } else {
        const newItem = {
          id: itemId,
          productId: product._id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          subCategory: product.subCategory || '',
          size,
          weight,
          unitWeightKg: unitKg,
          quantity: qty,
          totalWeightKg: totalKg,
          imageUrl: product.imageUrl || '',
          price: product.price || 'On Request',
        };
        return [...prevCart, newItem];
      }
    });

    // Show temporary toast notification
    setToastMessage(`Added ${qty} pcs of ${product.name} (${size}) to Cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Update Quantity
  const updateQuantity = (itemId, newQty) => {
    const qty = Math.max(1, Number(newQty) || 1);
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === itemId) {
          const totalKg = item.unitWeightKg > 0 ? parseFloat((item.unitWeightKg * qty).toFixed(2)) : 0;
          return {
            ...item,
            quantity: qty,
            totalWeightKg: totalKg,
          };
        }
        return item;
      })
    );
  };

  // Remove single item
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculated totals
  const totalItemsCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalWeightKg = cart.reduce((sum, item) => sum + (Number(item.totalWeightKg) || 0), 0);
  const totalWeightTons = totalWeightKg > 0 ? (totalWeightKg / 1000).toFixed(3) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        totalWeightKg: totalWeightKg.toFixed(1),
        totalWeightTons,
        itemTypesCount: cart.length,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Create the context (no export here)
const CartContext = createContext();

// 2. Provider component
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = async (paymentMethod) => {
    const order = {
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      paymentMethod,
    };

    try {
      await axios.post('http://localhost:5000/api/orders', order);
      alert('✅ Order placed successfully! Shop more fresh produce!');
      clearCart();
    } catch (error) {
      console.error('Order failed:', error);
      alert('❌ Failed to place order.');
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, clearCart, placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Custom hook
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 4. Export all at once, after definitions
export { CartContext, CartProvider, useCart };

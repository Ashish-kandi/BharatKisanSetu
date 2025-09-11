// src/pages/Cart.js or src/components/Cart.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const generateTrackingId = () =>
  'ORD' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, placeOrder } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      removeFromCart(item.id, true); // true = decrement (customize if needed)
    } else {
      removeFromCart(item.id);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    const id = generateTrackingId();
    await placeOrder(paymentMethod, id);
    setTrackingId(id);
    setOrderPlaced(true);
    setShowModal(false);
    localStorage.setItem(
      'lastOrder',
      JSON.stringify({
        id,
        items: cartItems,
        total,
        paymentMethod,
        status: 'Processing',
        placedAt: new Date().toISOString(),
      })
    );
    clearCart();
  };

  const handleTrackOrder = () => {
    navigate('/track-order');
  };

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h4>Your cart is empty!</h4>
          <Link to="/products">
            <button className="shop-btn">Shop Now</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-thumb" />
                <div className="cart-details">
                  <div className="cart-title-row">
                    <span className="cart-product-name">{item.name}</span>
                    <span className="cart-product-price">₹{item.price}/kg</span>
                  </div>
                  <div className="cart-qty-controls">
                    <button
                      className="qty-btn minus"
                      onClick={() => decreaseQuantity(item)}
                      aria-label="Decrease"
                    >
                      -
                    </button>
                    <span className="qty">{item.quantity}</span>
                    <button
                      className="qty-btn plus"
                      onClick={() => addToCart(item)}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-item-total">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h4>
              Total: <span className="cart-total-amount">₹{total}</span>
            </h4>
            <button className="checkout-btn" onClick={() => setShowModal(true)}>
              Proceed to Checkout
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Order Summary</h3>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} = ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p>
              <b>Total:</b> ₹{total}
            </p>
            <div style={{ margin: '16px 0' }}>
              <label>
                Payment Method:{' '}
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Cash on Delivery</option>
                  <option>UPI</option>
                  <option>Credit/Debit Card</option>
                </select>
              </label>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Confirm Order
            </button>
            <button className="clear-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Order placed message with tracking */}
      {orderPlaced && (
        <div className="order-success">
          <h3>✅ Order placed successfully!</h3>
          <p>
            Your tracking ID: <b>{trackingId}</b>
          </p>
          <button className="checkout-btn" onClick={handleTrackOrder}>
            Track Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

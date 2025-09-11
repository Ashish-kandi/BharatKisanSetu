import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const OrderHistory = () => {
  const { orders } = useContext(CartContext);

  return (
    <div className="container py-4">
      <h2>🧾 Order History</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="border p-3 mb-3">
            <h5>Order ID: {order.id}</h5>
            <p>Date: {order.date}</p>
            <ul>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.name} - {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}
                </li>
              ))}
            </ul>
            <strong>Total: ₹{order.total}</strong>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;

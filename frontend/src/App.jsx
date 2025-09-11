// src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [voiceInput, setVoiceInput] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/orders").then(res => setOrders(res.data));
    axios.get("http://localhost:3001/api/profile").then(res => setProfile(res.data));
  }, []);

  const acceptOrder = (id) => {
    axios.post(`http://localhost:3001/api/orders/${id}/accept`)
      .then(() => setOrders(prev => prev.map(order =>
        order.id === id ? { ...order, status: "accepted" } : order)));
  };

  const rejectOrder = (id) => {
    axios.post(`http://localhost:3001/api/orders/${id}/reject`)
      .then(() => setOrders(prev => prev.map(order =>
        order.id === id ? { ...order, status: "rejected" } : order)));
  };

  return (
    <div className="p-6 font-sans max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Connecting Farmers to Consumers</h1>

      {profile && (
        <div className="p-4 border rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p>{profile.location}</p>
          <p className="text-gray-600">Crops: {profile.crops.join(", ")}</p>
          <div className="flex gap-2 mt-2">
            <button className="bg-green-500 text-white px-4 py-1 rounded">Call</button>
            <button className="bg-blue-500 text-white px-4 py-1 rounded">Video Call</button>
            <button className="bg-gray-600 text-white px-4 py-1 rounded">Message</button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-lg mb-2">Voice Input</label>
        <input
          type="text"
          value={voiceInput}
          onChange={(e) => setVoiceInput(e.target.value)}
          placeholder="Speak now..."
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="p-4 border rounded shadow">
              <p><strong>{order.name}</strong> ordered <strong>{order.crop}</strong> - {order.quantity} kg in {order.days} days</p>
              {order.status === "pending" ? (
                <div className="mt-2 space-x-2">
                  <button onClick={() => acceptOrder(order.id)} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
                  <button onClick={() => rejectOrder(order.id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-1">Status: {order.status}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

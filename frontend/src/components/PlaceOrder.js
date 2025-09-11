// frontend/src/components/PlaceOrder.js
import React, { useState } from "react";
import MapPicker from "./MapPicker";
import axios from "axios";

export default function PlaceOrder() {
  const [location, setLocation] = useState(null);
  const [orderSent, setOrderSent] = useState(false);

  const handlePlaceOrder = async () => {
    if (!location) {
      alert("Please select a location on the map!");
      return;
    }
    try {
      await axios.post("http://localhost:5100/api/orders", {
        customerName: "Ashish", // Replace with live user name if available
        address: "Selected from map", // Adapt as needed
        lat: location.lat,
        lng: location.lng,
      });
      setOrderSent(true);
    } catch (err) {
      alert("Order failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Place Your Order</h2>
      <MapPicker onLocationSelected={setLocation} />
      {location && (
        <div>
          <p>Selected Location:</p>
          <p>Lat: {location.lat}</p>
          <p>Lng: {location.lng}</p>
        </div>
      )}
      <button onClick={handlePlaceOrder}>Place Order</button>
      {orderSent && <p>Your order is placed and being processed!</p>}
    </div>
  );
}

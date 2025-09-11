// frontend/src/components/MapPicker.js
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Geocoding function
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  throw new Error(`Could not find location for: ${address}`);
}

export default function MapPicker() {
  // Hardcoded farm location (example: Jubilee Hills, Hyderabad)
  const farmCoords = { lat: 17.4300, lng: 78.4200 };

  const [consumerAddresses, setConsumerAddresses] = useState([""]);
  const [consumers, setConsumers] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add consumer address field
  const addConsumerField = () => {
    setConsumerAddresses([...consumerAddresses, ""]);
  };

  // Update consumer address
  const updateConsumerAddress = (index, value) => {
    const updated = [...consumerAddresses];
    updated[index] = value;
    setConsumerAddresses(updated);
  };

  // Compute optimized route
  const getOptimizedRoute = async () => {
    if (consumerAddresses.length === 0 || consumerAddresses.some(addr => !addr.trim())) {
      alert("Please enter all consumer addresses.");
      return;
    }

    setLoading(true);
    try {
      // Geocode consumers
      const consumerCoords = [];
      for (const addr of consumerAddresses) {
        const coords = await geocodeAddress(addr);
        consumerCoords.push(coords);
      }
      setConsumers(consumerCoords);

      // Send to backend for optimization
      const locations = [...consumerCoords];
      const response = await fetch(
        "http://localhost:5100/api/quantum_route_optimize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations }),
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setOptimizedRoute(data.optimized_route);
        setRouteDistance(data.total_distance);
      } else {
        alert("Error in optimization: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetMap = () => {
    setConsumerAddresses([""]);
    setConsumers([]);
    setOptimizedRoute([]);
    setRouteDistance(null);
  };

  return (
    <div>
      <h3>Enter Consumer Addresses</h3>

      {consumerAddresses.map((addr, idx) => (
        <div key={idx}>
          <input
            type="text"
            value={addr}
            onChange={(e) => updateConsumerAddress(idx, e.target.value)}
            placeholder={`Enter consumer ${idx + 1} address`}
            style={{ width: "60%", margin: "5px" }}
          />
        </div>
      ))}
      <button onClick={addConsumerField}>+ Add Consumer</button>

      <br /><br />
      <button onClick={getOptimizedRoute} disabled={loading}>
        {loading ? "Computing..." : "Compute Quantum Route"}
      </button>
      <button onClick={resetMap} style={{ marginLeft: "10px" }}>
        Reset
      </button>

      {/* Show Optimized Order */}
      {optimizedRoute.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Optimized Order:</h3>
          <ol>
            {optimizedRoute.map((loc, idx) => (
              <li key={idx}>
                <b>Consumer {idx + 1}</b> ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
              </li>
            ))}
          </ol>
          <p>
            <b>Total Distance:</b> {routeDistance.toFixed(2)} km
          </p>
        </div>
      )}

      {/* Map */}
      <div style={{ marginTop: "20px" }}>
        <MapContainer
          center={[17.43, 78.42]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Consumer Markers */}
          {consumers.map((c, idx) => (
            <Marker key={idx} position={[c.lat, c.lng]}>
              <Popup>Consumer {idx + 1}</Popup>
            </Marker>
          ))}

          {/* Optimized Route */}
          {optimizedRoute.length > 0 && (
            <>
              <Polyline
                positions={optimizedRoute.map((loc) => [loc.lat, loc.lng])}
                color="blue"
              />
              {optimizedRoute.map((loc, idx) => (
                <Marker key={"route" + idx} position={[loc.lat, loc.lng]}>
                  <Popup>Stop {idx + 1}</Popup>
                </Marker>
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

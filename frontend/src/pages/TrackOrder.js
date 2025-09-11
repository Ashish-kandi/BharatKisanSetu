import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

const sampleLocations = [
  { name: "Farm", lat: 17.43, lng: 78.42 },
  { name: "Consumer 1", lat: 17.44, lng: 78.43 },
  { name: "Consumer 2", lat: 17.45, lng: 78.41 }
];

const DEFAULT_CENTER = [17.44, 78.42]; // Center map somewhere in the region

function TrackOrder() {
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [totalDistance, setTotalDistance] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimizeRoute = async () => {
    setOptimizing(true);
    setError(null);
    setOptimizedRoute(null);
    setTotalDistance(null);

    try {
      const response = await axios.post('http://localhost:5100/api/quantum_route_optimize', {
        locations: sampleLocations,
      });

      if (response.data.status === "success" && response.data.optimized_route) {
        setOptimizedRoute(response.data.optimized_route);
        setTotalDistance(response.data.total_distance);
      } else {
        setError("Route optimization failed, no route returned.");
      }
    } catch (err) {
      setError("Quantum route optimization failed! Try again.");
      console.error(err);
    }
    setOptimizing(false);
  };

  // Helper: convert route array to [lat, lng] pairs for Polyline
  const routePositions = optimizedRoute
    ? optimizedRoute.map(loc => [loc.lat, loc.lng])
    : [];

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 10, padding: 32 }}>
      <h2>Quantum Optimized Delivery Route</h2>
      <button onClick={handleOptimizeRoute} disabled={optimizing} style={{
        background: "#166683", color: "#fff", padding: "10px 18px", borderRadius: 6, border: "none", fontWeight: 600
      }}>
        {optimizing ? "Optimizing..." : "Compute Quantum Route"}
      </button>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

      {/* SHOW OPTIMIZED ROUTE */}
      {optimizedRoute && (
        <div style={{ marginTop: 28 }}>
          <h4>Optimized Order:</h4>
          <ol>
            {optimizedRoute.map((loc, idx) => (
              <li key={idx}>
                <b>{loc.name}</b> &nbsp;
                (<span style={{ fontSize: '90%' }}>{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</span>)
              </li>
            ))}
          </ol>
          {totalDistance !== null && (
            <div style={{ marginTop: 14, fontWeight: 500 }}>
              <span style={{ color: "#166683" }}>
                Total Distance: {totalDistance.toFixed(2)} km
              </span>
            </div>
          )}

          {/* MAP VISUALIZATION */}
          <div style={{ margin: "26px 0" }}>
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Draw Polyline */}
              <Polyline positions={routePositions} color="blue" />
              {/* Draw markers */}
              {optimizedRoute.map((loc, idx) => (
                <Marker position={[loc.lat, loc.lng]} key={idx}>
                  <Popup>{loc.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <div style={{ fontStyle: "italic", color: "#166683" }}>
            Route computed using quantum-inspired optimization.
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;

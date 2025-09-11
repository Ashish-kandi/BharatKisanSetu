import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper component to handle map clicks
function LocationPicker({ farm, setFarm, consumers, setConsumers }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (!farm) {
        setFarm({ lat, lng });
      } else {
        setConsumers([...consumers, { lat, lng }]);
      }
    }
  });
  return null;
}

export default function DynamicRouteMap() {
  const [farm, setFarm] = useState(null);
  const [consumers, setConsumers] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);

  // Call backend to get the optimized route with farm+consumers
  const getOptimizedRoute = async () => {
    if (!farm || consumers.length === 0) {
      alert("Please select farm and at least one consumer on the map.");
      return;
    }

    const locations = [farm, ...consumers];

    try {
      const response = await fetch("http://localhost:5100/api/quantum_route_optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setOptimizedRoute(data.optimized_route);
        setRouteDistance(data.total_distance);
      } else {
        alert("Optimization failed: " + data.error);
      }
    } catch (error) {
      alert("Network or server error: " + error.message);
    }
  };

  return (
    <div>
      <h3>Click on the map to select locations</h3>
      <p>
        <b>First click:</b> sets the <i>farm</i> location.<br />
        <b>Subsequent clicks:</b> add <i>consumer</i> locations.
      </p>
      <MapContainer center={[17.43, 78.42]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker farm={farm} setFarm={setFarm} consumers={consumers} setConsumers={setConsumers} />

        {/* Mark farm location */}
        {farm && (
          <Marker position={[farm.lat, farm.lng]}>
            <Popup>Farm</Popup>
          </Marker>
        )}

        {/* Mark consumer locations */}
        {consumers.map((c, idx) => (
          <Marker key={idx} position={[c.lat, c.lng]}>
            <Popup>Consumer {idx + 1}</Popup>
          </Marker>
        ))}

        {/* Draw optimized route if available */}
        {optimizedRoute.length > 0 && (
          <>
            <Polyline positions={optimizedRoute.map(loc => [loc.lat, loc.lng])} color="blue" />
            {optimizedRoute.map((loc, idx) => (
              <Marker key={"route" + idx} position={[loc.lat, loc.lng]}>
                <Popup>Stop {idx + 1}</Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>

      <button onClick={getOptimizedRoute} style={{ marginTop: "10px", padding: "8px 15px" }}>
        Compute Optimized Route
      </button>

      {routeDistance !== null && (
        <p>Total Distance: {routeDistance.toFixed(2)}</p>
      )}

      <p style={{ marginTop: "20px", fontStyle: "italic" }}>
        Click on the map to pick locations. For farm first, consumers next.
      </p>
    </div>
  );
}

// frontend/src/components/TrackOrder.js
import React, { useState } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

export default function TrackOrder() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [route, setRoute] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const handleTrack = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/quantum_route_optimize");
      setRoute(res.data.optimized_route || []);
      setShowMap(true);
    } catch (error) {
      alert("Failed to load route data");
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <h2>Track Your Order</h2>
      <button onClick={handleTrack}>Show Optimized Route Map</button>
      {showMap && route.length > 0 && (
        <GoogleMap
          center={{ lat: route[0].lat, lng: route[0].lng }}
          zoom={12}
          mapContainerStyle={{ width: "100%", height: "400px" }}
        >
          {route.map((loc, idx) => (
            <Marker key={idx} position={{ lat: loc.lat, lng: loc.lng }} label={loc.name} />
          ))}
          <Polyline
            path={route.map((loc) => ({ lat: loc.lat, lng: loc.lng }))}
            options={{ strokeColor: "#00b4d8", strokeWeight: 4 }}
          />
        </GoogleMap>
      )}
    </div>
  );
}

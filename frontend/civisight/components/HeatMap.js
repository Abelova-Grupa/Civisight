import React, { useEffect, useState } from "react";

const HeatMapWeb = ({ points }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) return null; 

  const { MapContainer, TileLayer, Circle } = require("react-leaflet");
  require("leaflet/dist/leaflet.css");

const getCircleOptions = (urgency) => {
  switch (urgency) {
    case "VERY_LOW":
      return { color: "#e6da72ff", weight: 20 }; // svetlo žuto
    case "LOW":
      return { color: "#FFCC66", weight: 40 }; // žuto-narandžasto
    case "MEDIUM":
      return { color: "#FF9933", weight: 60 }; // narandžasto
    case "HIGH":
      return { color: "#FF6666", weight: 80 }; // svetlo crveno
    case "CRITICAL":
      return { color: "#FF0000", weight: 100 }; // crveno
    default:
      return { color: "gray", weight: 30 };
  }
};


  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[44.8176, 20.4569]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.map((p, i) => {
          const { color, weight } = getCircleOptions(p.urgency);
          return (
            <Circle
              key={i}
              center={[p.latitude, p.longitude]}
              radius={weight}
              pathOptions={{ color, fillOpacity: 0.5 }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HeatMapWeb;

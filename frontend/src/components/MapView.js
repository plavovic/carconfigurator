import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// JCS coordinates
const position = [43.85588034235111, 18.387376092319784];


L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

const MapView = () => {
  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "400px", width: "100%", margin: "auto" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Car Configurator</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrige ícones padrão
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const userIcon = new L.Icon({
  iconUrl: "/icons/user-pin.png", // Supondo que o ícone exista em public/icons
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

function LeafletMapComponent({
  initialCenter = [-23.5505, -46.6333],
  initialZoom = 13,
  markers = [],
  userLocation = null,
  style = { height: "400px", width: "100%" },
}) {
  const mapCenter = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : initialCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={initialZoom}
      style={style}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeMapView
        center={
          userLocation ? [userLocation.latitude, userLocation.longitude] : null
        }
      />

      {userLocation && (
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup>Você está aqui</Popup>
        </Marker>
      )}

      {markers.map((marker, index) => (
        <Marker key={marker.id || index} position={marker.position}>
          {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
}

export default LeafletMapComponent;

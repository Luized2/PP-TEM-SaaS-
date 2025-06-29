import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "./EstablishmentMap.css";

// Ícone personalizado criado com CSS para os marcadores
const createCustomIcon = (hasLiveMusic) => {
  return L.divIcon({
    className: `custom-marker ${hasLiveMusic ? "has-live-music" : ""}`,
    html: `<div class="marker-pin"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Componente auxiliar para ajustar o mapa para mostrar todos os marcadores
function MapBounds({ establishments }) {
  const map = useMap();
  useEffect(() => {
    if (establishments && establishments.length > 0) {
      const validLocations = establishments
        .filter((e) => e.location?.latitude && e.location?.longitude)
        .map((e) => [e.location.latitude, e.location.longitude]);

      if (validLocations.length > 0) {
        map.fitBounds(validLocations, { padding: [50, 50] });
      }
    }
  }, [map, establishments]);

  return null;
}

/**
 * Componente para exibir um mapa com marcadores de estabelecimentos.
 */
function EstablishmentMap({
  establishments,
  center = [-15.7496, -43.3032],
  zoom = 14,
}) {
  const navigate = useNavigate();

  // Corrige um problema comum com os ícones padrão do Leaflet no React
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);

  return (
    <div className="establishment-map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {establishments
          .filter((e) => e.location?.latitude && e.location?.longitude)
          .map((est) => (
            <Marker
              key={est.id}
              position={[est.location.latitude, est.location.longitude]}
              icon={createCustomIcon(est.hasLiveMusic)}
            >
              <Popup className="establishment-map-popup">
                {est.imageUrl && (
                  <img
                    src={est.imageUrl}
                    alt={est.name}
                    className="establishment-map-image"
                  />
                )}
                <h3>{est.name}</h3>
                <p className="establishment-map-category">{est.category}</p>
                {est.rating && (
                  <div className="establishment-map-rating">
                    {est.rating.toFixed(1)} <span className="star">★</span>
                  </div>
                )}
                <button
                  className="establishment-map-button"
                  onClick={() => navigate(`/establishments/${est.id}`)}
                >
                  Ver detalhes
                </button>
              </Popup>
            </Marker>
          ))}
        <MapBounds establishments={establishments} />
      </MapContainer>
    </div>
  );
}

EstablishmentMap.propTypes = {
  establishments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
    })
  ).isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
};

export default EstablishmentMap;

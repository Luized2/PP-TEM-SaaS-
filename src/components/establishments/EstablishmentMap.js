import React from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Corrige um problema comum com os ícones padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function EstablishmentMap({ establishments }) {
  // Posição inicial do mapa (ex: centro de Porteirinha, MG)
  const mapCenter = [-15.7496, -43.3032];

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={mapCenter}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        {/* Camada de tiles do mapa - a imagem do mapa em si. Usando OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Itera sobre a lista de estabelecimentos para criar os marcadores */}
        {establishments.map((est) => {
          // Garante que o estabelecimento tenha coordenadas válidas antes de tentar renderizar o marcador
          if (est.location && est.location.lat && est.location.lng) {
            return (
              <Marker
                key={est.id}
                position={[est.location.lat, est.location.lng]}
              >
                <Popup>
                  <strong>{est.name}</strong>
                  <br />
                  {est.address || "Endereço não disponível"}
                  <br />
                  {/* Poderia adicionar um link para a página de detalhes do estabelecimento */}
                  <a
                    href={`/establishments/${est.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver detalhes
                  </a>
                </Popup>
              </Marker>
            );
          }
          return null; // Não renderiza nada se não houver coordenadas
        })}
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
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }),
    })
  ).isRequired,
};

export default EstablishmentMap;

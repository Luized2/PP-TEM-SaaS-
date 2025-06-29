import React from "react";
import EstablishmentMap from "../components/establishments/EstablishmentMap";
import { useFirestoreQuery } from "../hooks/useFirestoreQuery";
import { collection, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";

function MapPage() {
  // Query para buscar apenas estabelecimentos que tenham uma localização definida.
  const establishmentsQuery = query(
    collection(db, "establishments"),
    where("location", "!=", null)
  );

  const {
    data: establishments,
    loading,
    error,
  } = useFirestoreQuery(establishmentsQuery);

  return (
    <div className="map-page-container" style={{ padding: "2rem" }}>
      <h1>Mapa de Estabelecimentos</h1>
      <p>Encontre todos os locais do nosso catálogo num só lugar.</p>

      {loading && <Spinner size="large" />}
      {error && (
        <Alert
          type="danger"
          message={`Ocorreu um erro ao carregar os dados: ${error.message}`}
        />
      )}

      {!loading && !error && (
        <EstablishmentMap establishments={establishments} />
      )}
    </div>
  );
}

export default MapPage;

import React from "react";
import useFirestoreQuery from "../../hooks/useFirestoreQuery";
import EstablishmentCard from "./EstablishmentCard";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./EstablishmentList.css";

function EstablishmentList() {
  // Por agora, vamos buscar todos os estabelecimentos, ordenados por rating.
  // Filtros mais complexos podem ser adicionados aqui no futuro.
  const establishmentsQuery = query(
    collection(db, "establishments"),
    orderBy("rating", "desc")
  );

  const {
    data: establishments,
    loading,
    error,
    hasMore,
    loadMore,
  } = useFirestoreQuery(establishmentsQuery, { pageSize: 6 });

  if (loading && establishments.length === 0) {
    return (
      <div className="establishment-list-feedback">
        <Spinner size="large" />
        <p>A carregar estabelecimentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="establishment-list-feedback">
        <Alert type="danger" message={`Ocorreu um erro: ${error.message}`} />
      </div>
    );
  }

  if (establishments.length === 0) {
    return (
      <div className="establishment-list-feedback">
        <p>Nenhum estabelecimento encontrado.</p>
      </div>
    );
  }

  return (
    <div className="establishment-list-container">
      <div className="establishment-list-grid">
        {establishments.map((establishment) => (
          <div key={establishment.id} className="establishment-list-item">
            <EstablishmentCard establishment={establishment} />
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="establishment-list-load-more">
          <Button onClick={loadMore} loading={loading}>
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  );
}

export default EstablishmentList;

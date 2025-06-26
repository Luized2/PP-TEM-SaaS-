import React from "react";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useFirestoreQuery } from "../hooks/useFirestoreQuery";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import EstablishmentMap from "../components/establishments/EstablishmentMap"; // <-- 1. Importar o mapa!
import "./EstablishmentsPage.css"; // <-- Opcional: para estilos da página

function EstablishmentsPage() {
  // A mesma query que já tínhamos para buscar os estabelecimentos
  const establishmentsQuery = query(
    collection(db, "establishments"),
    where("isActive", "==", true),
    orderBy("name")
  );

  const {
    data: establishments,
    loading,
    error,
  } = useFirestoreQuery(establishmentsQuery);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <p>Ocorreu um erro ao buscar os locais. Por favor, tente novamente.</p>
    );
  }

  return (
    <div className="establishments-page">
      <h1>Estabelecimentos</h1>
      <p>Descubra os melhores locais da cidade, no mapa ou na lista abaixo.</p>

      {/* 2. Renderizar o componente do mapa, passando os dados */}
      <div className="map-section">
        <EstablishmentMap establishments={establishments} />
      </div>

      <div className="list-section">
        <h2>Todos os Locais</h2>
        <div className="establishments-list">
          {establishments.length > 0 ? (
            establishments.map((est) => (
              <Card key={est.id} className="establishment-card">
                {/* Se houver imagem, podemos usar o Card.Image */}
                {est.imageUrl && (
                  <Card.Image src={est.imageUrl} alt={est.name} />
                )}
                <Card.Body>
                  <h3>{est.name}</h3>
                  <p>{est.shortDescription || "Sem descrição."}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>Nenhum estabelecimento encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EstablishmentsPage;

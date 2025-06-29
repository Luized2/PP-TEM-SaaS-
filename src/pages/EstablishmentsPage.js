import React from "react";
// import { collection, query, where, orderBy } from 'firebase/firestore'; // Será usado depois
// import { db } from '../services/firebase'; // Será usado depois
import EstablishmentList from "../components/establishments/EstablishmentList"; // Supondo que você criou este

function EstablishmentsPage() {
  return (
    <div>
      <h1>Estabelecimentos</h1>
      <p>Descubra os melhores locais da cidade.</p>
      {/* O EstablishmentList irá conter a lógica de busca e exibição */}
      <EstablishmentList />
    </div>
  );
}

export default EstablishmentsPage;

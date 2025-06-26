// src/hooks/useFirestoreQuery.js
import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

export function useFirestoreQuery(firestoreQuery) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // onSnapshot escuta as mudanças em tempo real
    const unsubscribe = onSnapshot(
      firestoreQuery,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    // Limpa o listener ao desmontar
    return unsubscribe;
  }, [firestoreQuery]); // Re-executa se a query mudar

  return { data, loading, error };
}

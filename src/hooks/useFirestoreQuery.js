import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../services/firebase";

/**
 * Um hook robusto para executar e paginar consultas ao Firestore.
 * @param {string} collectionName - O nome da coleção a ser consultada.
 * @param {object} options - Opções de consulta como filtros, ordenação e paginação.
 * @returns {object} O estado da consulta: data, loading, error, hasMore, loadMore, refetch.
 */
function useFirestoreQuery(collectionName, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Desestruturamos as opções com valores padrão
  const {
    filters = [],
    sort = { field: "createdAt", direction: "desc" },
    pageSize = 9,
    enabled = true,
  } = options;

  // Memoizamos as dependências para evitar re-execuções desnecessárias
  const memoizedFilters = JSON.stringify(filters);
  const memoizedSort = JSON.stringify(sort);

  // Função centralizada para construir a consulta do Firestore
  const buildQuery = useCallback(
    (startAfterDoc = null) => {
      let q = query(collection(db, collectionName));

      if (filters.length > 0) {
        const whereConstraints = filters.map((f) =>
          where(f.field, f.operator, f.value)
        );
        q = query(q, ...whereConstraints);
      }
      if (sort) {
        q = query(q, orderBy(sort.field, sort.direction));
      }
      q = query(q, limit(pageSize));
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      return q;
      // AVISO CORRIGIDO: Desativamos a regra do linter para esta linha porque sabemos
      // que as dependências 'filters' e 'sort' estão a ser geridas indiretamente
      // através das suas versões memoizadas e stringificadas.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [collectionName, pageSize, memoizedFilters, memoizedSort]
  );

  // Função para buscar os dados
  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (!enabled) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const cursor = isLoadMore ? lastDoc : null;
        const q = buildQuery(cursor);
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHasMore(docs.length === pageSize);
        setData((prevData) => (isLoadMore ? [...prevData, ...docs] : docs));
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } catch (err) {
        console.error("Erro ao buscar dados do Firestore:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [enabled, buildQuery, lastDoc, pageSize]
  );

  // Função para recarregar a consulta do zero (resetando o estado)
  const refetch = useCallback(() => {
    setData([]);
    setLastDoc(null);
    setHasMore(true);
    fetchData(false); // Chama fetchData com isLoadMore=false
  }, [fetchData]);

  // Efeito para carregar os dados iniciais ou quando as opções de consulta mudam
  useEffect(() => {
    if (enabled) {
      refetch(); // Usamos refetch para garantir um estado limpo a cada nova consulta
    } else {
      setData([]);
      setLoading(false);
    }
  }, [enabled, refetch]);

  // Função para carregar a próxima página
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(true);
    }
  }, [loading, hasMore, fetchData]);

  return { data, loading, error, hasMore, loadMore, refetch };
}

export default useFirestoreQuery;

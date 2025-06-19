// src/hooks/useSubscription.js

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

// Níveis de permissão para planos. Facilita a verificação "pelo menos X".
const planPermissionLevels = {
  free: 1,
  pro: 2,
  business: 3,
};

export function useSubscription() {
  const { currentUser } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setSubscriptionData(null);
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const sub = userData.subscription;
          if (sub && sub.status === "active") {
            setSubscriptionData(sub);
          } else {
            setSubscriptionData({
              status: "free",
              plan: "free",
              features: {
                maxEstablishments: 1,
                reports: "none",
                eventLimit: 3,
                highlight: "none",
              },
            });
          }
        } else {
          setError("Dados do usuário não encontrados.");
          setSubscriptionData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao ouvir dados da assinatura:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Verifica se o usuário tem acesso a uma feature com base em diferentes critérios.
   * @param {string} featureKey - A chave da feature (ex: 'plan', 'maxEstablishments').
   * @param {object} [options={}] - Opções de comparação.
   * @param {*} [options.equalTo] - Verifica igualdade estrita (ex: 'pro').
   * @param {string|number} [options.atLeast] - Verifica se o valor é no mínimo o esperado.
   * @returns {boolean} - Retorna true se o acesso for permitido.
   */
  const hasAccess = useCallback(
    (featureKey, options = {}) => {
      if (loading || !subscriptionData) return false;

      // Procura a feature primeiro no objeto `features`, depois no objeto raiz da assinatura
      const featureValue =
        subscriptionData.features?.[featureKey] ?? subscriptionData[featureKey];

      if (options.equalTo !== undefined) {
        return featureValue === options.equalTo;
      }

      if (options.atLeast !== undefined) {
        // Verificação para níveis de plano
        if (featureKey === "plan" && typeof featureValue === "string") {
          const userLevel = planPermissionLevels[featureValue] || 0;
          const requiredLevel = planPermissionLevels[options.atLeast] || 0;
          return userLevel >= requiredLevel;
        }
        // Verificação para valores numéricos
        if (
          typeof featureValue === "number" &&
          typeof options.atLeast === "number"
        ) {
          return featureValue >= options.atLeast;
        }
      }

      // Verificação padrão: a feature existe e não é um valor "falsy" ou 'none'
      return !!featureValue && featureValue !== "none";
    },
    [subscriptionData, loading]
  );

  return {
    subscription: subscriptionData,
    loading,
    error,
    hasAccess,
    isActive: subscriptionData?.status === "active",
    plan: subscriptionData?.plan,
  };
}

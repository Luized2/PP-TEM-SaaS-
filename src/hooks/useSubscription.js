// src/hooks/useSubscription.js

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

// NOVO: Níveis de permissão para planos. Facilita a verificação "pelo menos X".
const planPermissionLevels = {
  free: 1,
  pro: 2,
  business: 3,
};

export function useSubscription() {
  const { currentUser } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A lógica de `useEffect` para ouvir o Firestore permanece a mesma.
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
          // Se o usuário tem uma assinatura ativa, usa os dados dela.
          if (sub && sub.status === "active") {
            //
            setSubscriptionData(sub);
          } else {
            // Define um objeto padrão para o plano gratuito se não houver assinatura.
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
          // ... tratamento de erro
          setSubscriptionData(null);
        }
        setLoading(false);
      },
      (error) => {
        // ... tratamento de erro
        console.error("Erro ao ouvir dados da assinatura:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  /**
   * NOVO: Função de verificação de acesso centralizada e mais poderosa.
   * Verifica se o usuário tem acesso a uma feature com base em diferentes critérios.
   * @param {string} featureKey - A chave da feature (ex: 'plan', 'maxEstablishments').
   * @param {object} options - Opções de comparação.
   * @param {*} options.equalTo - Verifica igualdade estrita (ex: 'pro').
   * @param {string|number} options.atLeast - Verifica se o valor é no mínimo o esperado.
   * Funciona para números ou para níveis de plano.
   */
  const hasAccess = useCallback(
    (featureKey, options = {}) => {
      if (loading || !subscriptionData) return false;

      const featureValue =
        subscriptionData.features?.[featureKey] ?? subscriptionData[featureKey];

      if (options.equalTo !== undefined) {
        return featureValue === options.equalTo;
      }

      if (options.atLeast !== undefined) {
        // Verificação para níveis de plano (ex: 'business' tem acesso a features 'pro')
        if (featureKey === "plan" && typeof featureValue === "string") {
          const userLevel = planPermissionLevels[featureValue] || 0;
          const requiredLevel = planPermissionLevels[options.atLeast] || 0;
          return userLevel >= requiredLevel;
        }
        // Verificação para valores numéricos (ex: limite de estabelecimentos)
        if (
          typeof featureValue === "number" &&
          typeof options.atLeast === "number"
        ) {
          return featureValue >= options.atLeast;
        }
      }

      // Verificação padrão: a feature existe e não é 'none'
      return !!featureValue && featureValue !== "none";
    },
    [subscriptionData, loading]
  );

  return {
    subscription: subscriptionData,
    loading,
    hasAccess, // Exporta a nova função de verificação
    isActive: subscriptionData?.status === "active", //
    plan: subscriptionData?.plan,
  };
}

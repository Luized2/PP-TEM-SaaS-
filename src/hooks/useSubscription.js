import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

export function useSubscription() {
  const { currentUser } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    if (currentUser) {
      setLoading(true);
      setError(null);
      const userDocRef = doc(db, "users", currentUser.uid);
      unsubscribe = onSnapshot(
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
          setError(err.message);
          setSubscriptionData(null);
          setLoading(false);
        }
      );
    } else {
      setSubscriptionData(null);
      setLoading(false);
      setError(null);
    }
    return () => unsubscribe();
  }, [currentUser]);

  const canUseFeature = useCallback(
    (featureKey) => {
      if (loading || !subscriptionData) {
        return false;
      }
      return subscriptionData.features
        ? subscriptionData.features[featureKey]
        : undefined;
    },
    [subscriptionData, loading]
  );

  return {
    subscription: subscriptionData,
    loading,
    error,
    canUseFeature,
    isActive: subscriptionData?.status === "active",
  };
}

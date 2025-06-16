import React from "react";
import { useSubscription } from "../../hooks/useSubscription";
import { Link } from "react-router-dom";
// Supondo a existência de componentes Card e Button para o fallback
import Card from "./Card";
import Button from "./Button";

function FeatureGate({ feature, value, children, fallback, loadingComponent }) {
  const { subscription, loading, canUseFeature } = useSubscription();

  if (loading) {
    return loadingComponent || <p>Verificando assinatura...</p>;
  }

  let hasAccess = false;
  const featureValue = canUseFeature(feature);

  if (value !== undefined) {
    hasAccess = featureValue === value;
  } else {
    hasAccess = !!featureValue && featureValue !== "none";
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  const defaultFallback = (
    <Card>
      <Card.Body>
        <h4>Recurso Indisponível</h4>
        <p>Faça upgrade do seu plano para acessar esta funcionalidade.</p>
        <Link to="/planos">
          <Button>Ver Planos</Button>
        </Link>
      </Card.Body>
    </Card>
  );

  return fallback === null ? null : fallback || defaultFallback;
}

export default FeatureGate;

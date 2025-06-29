import React from "react";
import PlanSelector from "../components/subscription/PlanSelector";

function PlansPage() {
  return (
    // O MainLayout já fornecerá o Header e o Footer.
    // Esta página serve como um contentor para o nosso seletor de planos.
    <PlanSelector />
  );
}

export default PlansPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import PlanCard from "./PlanCard";
import Modal from "../common/Modal";
import Button from "../common/Button";
import "./PlanSelector.css";

// Em uma aplicação real, estes dados viriam do backend ou de um ficheiro de configuração.
const PLANS = [
  {
    id: "free",
    name: "Básico",
    price: 0,
    interval: "mês",
    description: "Perfeito para começar a divulgar seu estabelecimento",
    features: [
      "Listagem básica do estabelecimento",
      "Até 3 fotos",
      "Informações de contato e horário",
    ],
  },
  {
    id: "pro",
    name: "Profissional",
    price: 49.9,
    interval: "mês",
    description: "Ideal para negócios que querem mais visibilidade e destaque",
    features: [
      "Tudo do plano Básico",
      "Destaque nos resultados de busca",
      "Até 10 fotos e 1 vídeo",
      "Criação de Eventos e Promoções",
      "Relatórios de visualizações",
    ],
    isPopular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 99.9,
    interval: "mês",
    description: "Visibilidade máxima e recursos exclusivos para grandes redes",
    features: [
      "Tudo do plano Profissional",
      "Fotos e vídeos ilimitados",
      "Notificações para seguidores",
      "Suporte prioritário 24/7",
    ],
  },
];

function PlanSelector() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { addNotification } = useNotification();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPlanId = userProfile?.subscription?.planId || "free";

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmPlan = () => {
    if (!currentUser) {
      addNotification(
        "Você precisa de estar logado para assinar um plano.",
        "warning"
      );
      navigate("/login", { state: { from: { pathname: "/planos" } } });
      return;
    }

    navigate(`/checkout/${selectedPlan.id}`);
    setIsModalOpen(false);
  };

  return (
    <div className="plan-selector-container">
      <div className="plan-selector-header">
        <h2>Escolha o plano ideal para o seu estabelecimento</h2>
        <p>
          Aumente a sua visibilidade e atraia mais clientes com os nossos planos
          personalizados.
        </p>
      </div>
      <div className="plan-selector-grid">
        {PLANS.map((plan) => (
          <div key={plan.id} className="plan-selector-item">
            <PlanCard
              plan={plan}
              isPopular={plan.isPopular}
              isCurrentPlan={currentPlanId === plan.id}
              onSelectPlan={handleSelectPlan}
            />
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar Seleção de Plano"
        size="small"
      >
        {selectedPlan && (
          <div className="plan-confirmation">
            <p>
              Você selecionou o plano <strong>{selectedPlan.name}</strong>.
            </p>
            <p>
              Valor:{" "}
              <strong>
                R$ {selectedPlan.price.toFixed(2).replace(".", ",")}/
                {selectedPlan.interval}
              </strong>
            </p>
            <div className="plan-confirmation-actions">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleConfirmPlan}>
                Continuar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PlanSelector;

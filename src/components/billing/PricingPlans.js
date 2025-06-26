import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import "./PricingPlans.css";

// Dados dos planos de assinatura. Facilita a manutenção.
const plans = [
  {
    name: "Free",
    price: "R$0",
    frequency: "/mês",
    description: "Comece a organizar e a ser descoberto na sua cidade.",
    features: [
      "Até 1 estabelecimento",
      "Criação de até 3 eventos por mês",
      "Página de perfil básica",
      "Suporte via comunidade",
    ],
    buttonText: "Começar Agora",
    buttonVariant: "outline",
    action: "/register",
    isFeatured: false,
  },
  {
    name: "Pro",
    price: "R$49",
    frequency: "/mês",
    description:
      "Ideal para negócios em crescimento que querem mais visibilidade.",
    features: [
      "Até 5 estabelecimentos",
      "Eventos ilimitados",
      "Notificações para seguidores",
      "Dashboard com estatísticas básicas",
      "Suporte prioritário por email",
    ],
    buttonText: "Escolher Pro",
    buttonVariant: "primary",
    action: "/checkout/pro", // Rota de exemplo para o checkout
    isFeatured: true,
  },
  {
    name: "Business",
    price: "Contato",
    frequency: "",
    description: "Soluções completas para grandes redes ou eventos especiais.",
    features: [
      "Estabelecimentos ilimitados",
      "Gestão de múltiplos utilizadores",
      "API de integração",
      "Relatórios avançados",
      "Gestor de conta dedicado",
    ],
    buttonText: "Fale Conosco",
    buttonVariant: "secondary",
    action: "/contact",
    isFeatured: false,
  },
];

function PricingPlans() {
  const navigate = useNavigate();

  const handleButtonClick = (action) => {
    // Futuramente, aqui podemos passar dados para a página de checkout
    navigate(action);
  };

  return (
    <div className="pricing-plans-container">
      <div className="pricing-header">
        <h2>Planos Sob Medida para o seu Negócio</h2>
        <p>
          Escolha o plano que melhor se adapta às suas necessidades e comece a
          crescer.
        </p>
      </div>
      <div className="plans-grid">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`plan-card ${plan.isFeatured ? "featured" : ""}`}
          >
            {plan.isFeatured && (
              <div className="featured-badge">Mais Popular</div>
            )}
            <Card.Header>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-amount">{plan.price}</span>
                {plan.frequency && (
                  <span className="price-frequency">{plan.frequency}</span>
                )}
              </div>
              <p className="plan-description">{plan.description}</p>
            </Card.Header>
            <Card.Body>
              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </Card.Body>
            <Card.Footer>
              <Button
                variant={plan.buttonVariant}
                onClick={() => handleButtonClick(plan.action)}
                className="w-100"
              >
                {plan.buttonText}
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PricingPlans;

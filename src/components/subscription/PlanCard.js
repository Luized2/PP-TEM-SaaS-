import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import "./PlanCard.css";

/**
 * Exibe um único plano de assinatura de forma visual.
 */
function PlanCard({
  plan,
  isPopular = false,
  isCurrentPlan = false,
  onSelectPlan,
}) {
  const { id, name, price, interval, features, description } = plan;

  return (
    <div className={`plan-card ${isPopular ? "plan-card-popular" : ""}`}>
      {isPopular && <div className="plan-card-badge">Mais Popular</div>}

      <div className="plan-card-header">
        <h3 className="plan-card-title">{name}</h3>
        <div className="plan-card-price">
          {price > 0 ? (
            <>
              <span className="plan-card-currency">R$</span>
              <span className="plan-card-amount">
                {price.toFixed(2).replace(".", ",")}
              </span>
              <span className="plan-card-interval">/{interval}</span>
            </>
          ) : (
            <span className="plan-card-amount">Grátis</span>
          )}
        </div>
        <p className="plan-card-description">{description}</p>
      </div>

      <div className="plan-card-features">
        <ul>
          {features.map((feature, index) => (
            <li key={index} className="plan-card-feature">
              <span className="plan-card-feature-icon">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="plan-card-footer">
        <Button
          onClick={() => onSelectPlan(plan)}
          disabled={isCurrentPlan}
          variant={isPopular ? "primary" : "outline"}
          className="plan-card-button"
        >
          {isCurrentPlan ? "Plano Atual" : "Selecionar Plano"}
        </Button>
      </div>
    </div>
  );
}

PlanCard.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    interval: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
  }).isRequired,
  isPopular: PropTypes.bool,
  isCurrentPlan: PropTypes.bool,
  onSelectPlan: PropTypes.func.isRequired,
};

export default PlanCard;

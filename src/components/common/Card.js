import React from "react";
import PropTypes from "prop-types";
import "./Card.css"; // Onde definiremos os estilos

function Card({ children, className = "", onClick, ...props }) {
  // Constrói a lista de classes CSS dinamicamente
  const cardClasses = [
    "card",
    onClick ? "card-clickable" : "", // Adiciona classe se o card for clicável
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const accessibilityProps = onClick
    ? {
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && onClick(),
      }
    : {};

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...accessibilityProps}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Definição dos Subcomponentes ---

Card.Header = function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};
Card.Header.displayName = "Card.Header";

Card.Body = function CardBody({ children, className = "", ...props }) {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};
Card.Body.displayName = "Card.Body";

Card.Footer = function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};
Card.Footer.displayName = "Card.Footer";

Card.Image = function CardImage({ src, alt = "", className = "", ...props }) {
  return (
    <img src={src} alt={alt} className={`card-img ${className}`} {...props} />
  );
};
Card.Image.displayName = "Card.Image";

// --- Definição dos PropTypes ---

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Card.Header.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.Body.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default Card;

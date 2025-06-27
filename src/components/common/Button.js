import React from "react";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import "./Button.css";

/**
 * Componente de botão flexível que suporta variantes, tamanhos e estados de carregamento.
 */
function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const buttonClasses = ["btn", `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(" ");

  // O botão fica desabilitado se a prop 'disabled' for true OU se estiver no estado 'loading'
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {/* Se estiver a carregar, mostra o Spinner. Senão, mostra o texto (children). */}
      {loading ? <Spinner size="small" /> : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "outline",
    "link",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;

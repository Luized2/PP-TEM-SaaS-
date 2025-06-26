import React from "react";
import PropTypes from "prop-types";
import Spinner from "./Spinner"; // Usando o Spinner que já criamos
import "./Button.css"; // Onde definiremos os estilos

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // 'primary', 'secondary', 'danger', 'outline', 'link'
  size = "medium", // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  className = "",
  ...props // Pega quaisquer outras props (ex: 'aria-label') e passa para o botão
}) {
  // Constrói a lista de classes CSS dinamicamente com base nas props
  const buttonClasses = ["btn", `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(" "); // O filter(Boolean) remove classes vazias

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
      {/* Se estiver carregando, mostra o Spinner. Senão, mostra o texto (children). */}
      {loading ? <Spinner /> : children}
    </button>
  );
}

// PropTypes definem o "contrato" do nosso componente.
// É uma excelente prática para garantir que ele seja usado corretamente.
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

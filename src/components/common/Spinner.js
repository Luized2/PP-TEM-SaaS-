import React from "react";
import PropTypes from "prop-types";
import "./Spinner.css";

/**
 * Um componente de spinner reutilizável para indicar estados de carregamento.
 */
function Spinner({ size = "medium", className = "" }) {
  const spinnerClasses = ["spinner", `spinner-${size}`, className]
    .filter(Boolean)
    .join(" ");

  return <div className={spinnerClasses}></div>;
}

Spinner.propTypes = {
  /** O tamanho do spinner. */
  size: PropTypes.oneOf(["small", "medium", "large"]),
  /** Classes CSS adicionais para personalização. */
  className: PropTypes.string,
};

export default Spinner;

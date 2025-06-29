import React from "react";
import PropTypes from "prop-types";
import "./Alert.css";

/**
 * Um componente de alerta reutilizável para exibir mensagens.
 */
function Alert({ message, type = "info", onClose, className = "" }) {
  if (!message) return null;

  const alertClasses = [
    "alert",
    `alert-${type}`, // 'success', 'danger', 'warning', 'info'
    onClose ? "alert-dismissible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={alertClasses} role="alert">
      {message}
      {onClose && (
        <button
          type="button"
          className="alert-close-btn"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
      )}
    </div>
  );
}

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "danger", "warning", "info"]),
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;

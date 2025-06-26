// src/components/common/Alert.js
import React from "react";
import PropTypes from "prop-types";
import "./Alert.css";

function Alert({ message, type = "info", onClose, className = "" }) {
  if (!message) return null;

  const alertClasses = [
    "alert",
    `alert-${type}`, // 'info', 'success', 'warning', 'danger'
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
          className="close-btn"
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
  type: PropTypes.oneOf(["info", "success", "warning", "danger"]),
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;

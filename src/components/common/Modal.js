import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css";

/**
 * Um componente de Modal reutilizável, acessível e configurável, renderizado através de um Portal.
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  className = "",
}) {
  // Efeito para fechar com a tecla ESC e controlar o scroll do body
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden"; // Impede a rolagem da página principal
    }

    // Função de limpeza que é executada quando o componente é desmontado
    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = ""; // Restaura a rolagem
    };
  }, [isOpen, onClose, closeOnEsc]); // Re-executa o efeito se estas props mudarem

  // Não renderiza nada se o modal estiver fechado
  if (!isOpen) {
    return null;
  }

  // Função para fechar o modal ao clicar no fundo (overlay)
  const handleOverlayClick = (e) => {
    // Só fecha se a prop estiver ativa E o clique for no próprio overlay, não no conteúdo
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Constrói a lista de classes CSS para o conteúdo do modal
  const modalClasses = ["modal-content", `modal-${size}`, className]
    .filter(Boolean)
    .join(" ");

  // Usa o Portal para "teleportar" o JSX para um nó diferente do DOM
  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={modalClasses}>
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">
            {title}
          </h3>
          {showCloseButton && (
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Fechar"
            >
              &times;
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root") // O alvo do nosso portal no public/index.html
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large", "full"]),
  showCloseButton: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;

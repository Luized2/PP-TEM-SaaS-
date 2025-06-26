import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css"; // Onde iremos definir os estilos

// Elemento no HTML onde os portais serão montados
const modalRoot = document.getElementById("modal-root");

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerContent, // Conteúdo customizado para o rodapé (ex: botões)
  size = "medium", // 'small', 'medium', 'large'
}) {
  // Efeito para:
  // 1. Evitar o scroll da página principal quando o modal está aberto.
  // 2. Permitir fechar o modal com a tecla 'Escape'.
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.classList.add("modal-open");
      document.addEventListener("keydown", handleEsc);
    }

    // Função de limpeza: executada quando o componente é "desmontado"
    // ou quando a dependência 'isOpen' muda.
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]); // Roda o efeito sempre que 'isOpen' ou 'onClose' mudar

  // Não renderiza nada se a prop 'isOpen' for falsa
  if (!isOpen) {
    return null;
  }

  // Usa o Portal para renderizar o modal na #modal-root do seu HTML
  return ReactDOM.createPortal(
    // O backdrop escuro. O clique aqui fecha o modal.
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-container modal-${size}`}
        // Impede que o clique DENTRO do modal se propague e feche o modal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Fechar"
          >
            &times; {/* Ícone 'X' para fechar */}
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footerContent && <div className="modal-footer">{footerContent}</div>}
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footerContent: PropTypes.node,
  size: PropTypes.oneOf(["small", "medium", "large", "xl"]),
};

export default Modal;

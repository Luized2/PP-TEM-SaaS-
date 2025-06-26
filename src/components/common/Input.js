import React from "react";
import PropTypes from "prop-types";
import "./Input.css"; // Onde definiremos os estilos

// Usamos React.forwardRef para que o componente pai possa obter uma ref do <input> interno
const Input = React.forwardRef(
  (
    {
      label,
      id,
      type = "text",
      error,
      className = "",
      containerClassName = "",
      ...props // Pega quaisquer outras props (ex: 'onChange', 'value', 'placeholder')
    },
    ref // A ref é passada como segundo argumento
  ) => {
    // Cria um ID único para o input a partir do label, caso nenhum ID seja fornecido.
    // Isso é ótimo para acessibilidade (conectar label e input).
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    // Constrói as classes CSS dinamicamente
    const inputClasses = [
      "form-input",
      error ? "is-invalid" : "", // Adiciona a classe de erro se a prop 'error' existir
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const containerClasses = ["form-group", containerClassName]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref} // Aqui a "ponte" é estabelecida, a ref é anexada ao input
          type={type}
          className={inputClasses}
          aria-invalid={!!error} // Acessibilidade: informa aos leitores de tela que o campo é inválido
          aria-describedby={error ? `${inputId}-error` : undefined} // Conecta o input à sua mensagem de erro
          {...props}
        />
        {/* Se a prop 'error' for passada, exibe a mensagem de erro */}
        {error && (
          <div id={`${inputId}-error`} className="invalid-feedback">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; // Boa prática para debugging com forwardRef

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string, // Mensagem de erro a ser exibida
  className: PropTypes.string, // Classes customizadas para o elemento <input>
  containerClassName: PropTypes.string, // Classes customizadas para o <div> container
};

export default Input;

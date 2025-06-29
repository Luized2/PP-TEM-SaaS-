import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import "./Input.css";

const Input = forwardRef(
  (
    {
      type = "text",
      name,
      label,
      error,
      touched,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputClasses = [
      "form-input",
      // Adiciona a classe de erro apenas se o campo foi "tocado" E tem um erro.
      error && touched ? "input-error" : "",
      props.disabled ? "input-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const id = `input-${name}`;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
            {required && <span className="required-mark">*</span>}
          </label>
        )}
        <input
          id={id}
          name={name}
          type={type}
          ref={ref}
          className={inputClasses}
          aria-invalid={!!(error && touched)}
          aria-describedby={error && touched ? `${id}-error` : undefined}
          {...props}
        />
        {error && touched && (
          <div id={`${id}-error`} className="input-error-message" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;

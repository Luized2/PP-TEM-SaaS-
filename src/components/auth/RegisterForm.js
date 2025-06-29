import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import useForm from "../../hooks/useForm";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";
import "./AuthForms.css";

function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const [serverError, setServerError] = useState("");

  // Regras de validação robustas para o formulário de registo
  const validationRules = {
    displayName: {
      required: "O nome é obrigatório",
      minLength: {
        value: 2,
        message: "O nome deve ter pelo menos 2 caracteres",
      },
    },
    email: {
      required: "O email é obrigatório",
      email: "Por favor, insira um email válido",
    },
    password: {
      required: "A senha é obrigatória",
      minLength: {
        value: 8,
        message: "A senha deve ter pelo menos 8 caracteres",
      },
      // Regex para forçar senha forte: min. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message:
          "A senha deve conter maiúscula, minúscula, número e símbolo (@$!%*?&).",
      },
    },
    confirmPassword: {
      required: "A confirmação da senha é obrigatória",
      // Validação customizada para verificar se as senhas coincidem
      validate: (value, formValues) =>
        value === formValues.password || "As senhas não coincidem",
    },
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    { displayName: "", email: "", password: "", confirmPassword: "" },
    validationRules
  );

  const handleRegisterSubmit = async (formData) => {
    setServerError("");
    try {
      await register(formData.email, formData.password, formData.displayName);
      addNotification("Conta criada com sucesso! Bem-vindo(a)!", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage =
        "Ocorreu um erro ao criar a sua conta. Tente novamente.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está a ser utilizado por outra conta.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "O email fornecido é inválido.";
      }
      setServerError(errorMessage);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Criar Conta</h2>
      <form
        onSubmit={handleSubmit(handleRegisterSubmit)}
        noValidate
        className="auth-form"
      >
        {serverError && <Alert type="danger" message={serverError} />}

        <Input
          label="Nome Completo"
          type="text"
          name="displayName"
          value={values.displayName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.displayName}
          touched={touched.displayName}
          disabled={isSubmitting}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
          disabled={isSubmitting}
          required
        />
        <Input
          label="Senha"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
          disabled={isSubmitting}
          required
        />
        <Input
          label="Confirmar Senha"
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          disabled={isSubmitting}
          required
        />
        <div className="auth-form-actions">
          <Button
            type="submit"
            loading={isSubmitting}
            className="auth-submit-btn"
          >
            Criar Conta
          </Button>
        </div>
        <div className="auth-form-links">
          <span>
            Já tem uma conta?{" "}
            <Link to="/login" className="auth-link">
              Faça login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;

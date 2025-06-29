import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import useForm from "../../hooks/useForm";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert"; // Para exibir erros do servidor
import "./AuthForms.css";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const [serverError, setServerError] = useState("");

  // Tenta obter a página de origem para redirecionar após o login
  const from = location.state?.from?.pathname || "/dashboard";

  // Regras de validação para o formulário de login
  const validationRules = {
    email: {
      required: "O email é obrigatório",
      email: "Por favor, insira um email válido",
    },
    password: { required: "A senha é obrigatória" },
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ email: "", password: "" }, validationRules);

  // Esta função será chamada pelo handleSubmit do nosso hook useForm
  const handleLoginSubmit = async (formData) => {
    setServerError(""); // Limpa erros antigos do servidor
    try {
      await login(formData.email, formData.password);
      addNotification("Login realizado com sucesso!", "success");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      // Traduz os erros comuns do Firebase para mensagens amigáveis
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage =
          "Email ou senha incorretos. Por favor, verifique os seus dados.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Acesso temporariamente bloqueado devido a muitas tentativas. Tente novamente mais tarde.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Esta conta foi desativada por um administrador.";
      }
      setServerError(errorMessage);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Login</h2>
      <form
        onSubmit={handleSubmit(handleLoginSubmit)}
        noValidate
        className="auth-form"
      >
        {serverError && <Alert type="danger" message={serverError} />}

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
        <div className="auth-form-actions">
          <Button
            type="submit"
            loading={isSubmitting}
            className="auth-submit-btn"
          >
            Entrar
          </Button>
        </div>
        <div className="auth-form-links">
          <Link to="/reset-password" className="auth-link">
            Esqueceu a senha?
          </Link>
          <span className="auth-separator">|</span>
          <Link to="/register" className="auth-link">
            Criar uma conta
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

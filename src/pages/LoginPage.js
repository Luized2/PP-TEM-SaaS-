// src/pages/LoginPage.js
import React from "react";
import LoginForm from "../components/auth/LoginForm"; // 1. Importar o formulário

function LoginPage() {
  return (
    // 2. Renderizar o componente LoginForm.
    // O AuthLayout, que está no App.js, já vai centralizar este formulário na página.
    <LoginForm />
  );
}

export default LoginPage;

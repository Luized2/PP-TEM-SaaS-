// src/pages/RegisterPage.js
import React from "react";
import RegisterForm from "../components/auth/RegisterForm"; // 1. Importar o formulário de REGISTO

function RegisterPage() {
  return (
    // 2. Renderizar o componente RegisterForm.
    // Assim como na página de login, o AuthLayout no App.js
    // irá centralizar este formulário automaticamente.
    <RegisterForm />
  );
}

export default RegisterPage;

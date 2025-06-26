// src/components/layout/AuthLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import "./AuthLayout.css"; // Criaremos este arquivo a seguir

function AuthLayout() {
  return (
    <div className="auth-layout-container">
      <div className="auth-content-box">
        {/* O Outlet renderizará o formulário de Login ou Registro aqui */}
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;

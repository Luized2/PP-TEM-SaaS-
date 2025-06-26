// src/components/auth/AuthRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Spinner from "../common/Spinner";

function AuthRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  // Se o usuário JÁ ESTIVER logado...
  if (currentUser) {
    // Redireciona para o painel principal ou para a página de onde ele veio.
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Se não estiver logado, permite o acesso à página de login/registro.
  return children;
}

export default AuthRoute;

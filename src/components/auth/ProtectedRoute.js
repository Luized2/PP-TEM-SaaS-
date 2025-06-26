// src/components/auth/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Spinner from "../common/Spinner"; // Criaremos este Spinner a seguir

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation(); // Guarda a localização atual

  // 1. Enquanto o AuthContext verifica se há um usuário, mostramos um spinner
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

  // 2. Após a verificação, se não houver usuário, redireciona para a página de login
  if (!currentUser) {
    // state={{ from: location }} é crucial. Ele "lembra" a página que o usuário
    // tentou acessar, para que possamos redirecioná-lo de volta para lá após o login.
    // 'replace' evita que a página protegida entre no histórico do navegador.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se houver um usuário logado, permite o acesso e renderiza a página solicitada
  return children;
}

export default ProtectedRoute;

// src/components/layout/Header.js
import React from "react";
import { Link, NavLink } from "react-router-dom";
// import { useAuth } from '../../contexts/AuthContext'; // Descomentar depois
import "./Header.css"; // Criaremos este arquivo a seguir

function Header() {
  // const { currentUser, logout } = useAuth(); // Descomentar e usar depois
  const currentUser = null; // Placeholder para estilizar a versão "deslogado"

  const handleLogout = async () => {
    // try {
    //   await logout();
    // } catch (error) {
    //   console.error("Falha ao fazer logout:", error);
    // }
    console.log("Logout clicado (implementar)");
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          {/* Substituir por seu logo real */}
          <Link to="/">SaaS Catálogo</Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              {/* NavLink adiciona a classe 'active' automaticamente */}
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Início
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/establishments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Locais
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/events"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Eventos
              </NavLink>
            </li>
            {/* Adicionar mais links públicos conforme necessário */}
          </ul>
        </nav>
        <div className="auth-section">
          {currentUser ? (
            <div className="user-menu">
              <span>Olá, {currentUser.displayName || "Usuário"}</span>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Painel
              </NavLink>
              <button onClick={handleLogout} className="logout-button">
                Sair
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Entrar
              </NavLink>
              <NavLink to="/register" className="register-link">
                Cadastrar
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

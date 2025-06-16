import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Route Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRoute from "./components/auth/AuthRoute";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            {/* Adicionar outras rotas públicas aqui */}
          </Route>

          {/* Rotas de Autenticação */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <AuthRoute>
                  <RegisterPage />
                </AuthRoute>
              }
            />
          </Route>

          {/* Rotas Protegidas */}
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rota Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

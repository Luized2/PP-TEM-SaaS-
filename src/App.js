// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Componentes de Rota
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRoute from "./components/auth/AuthRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EstablishmentsPage from "./pages/EstablishmentsPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Novas Páginas (devem ser criadas)
import NewEstablishmentPage from "./pages/NewEstablishmentPage";
import CheckoutPage from "./pages/CheckoutPage";
import PricingPage from "./pages/PricingPage"; // Adicionada para o fluxo de monetização

import "./styles/global.css";

function App() {
  return (
    // O AuthProvider envolve toda a aplicação, disponibilizando o contexto
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas (dentro do MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/establishments" element={<EstablishmentsPage />} />
            <Route path="/pricing" element={<PricingPage />} />{" "}
            {/* Rota para a página de preços */}
          </Route>

          {/* Rotas de Autenticação (dentro do AuthLayout e protegidas pelo AuthRoute) */}
          <Route
            element={
              <AuthRoute>
                <AuthLayout />
              </AuthRoute>
            }
          >
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rotas Protegidas (dentro do MainLayout e protegidas pelo ProtectedRoute) */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/establishments/new"
              element={<NewEstablishmentPage />}
            />
            <Route path="/checkout/:planId" element={<CheckoutPage />} />
          </Route>

          {/* Rota Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

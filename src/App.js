import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Provedores de Contexto Globais
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext"; // Essencial para as notificações

// 2. Componentes de Layout Estruturais
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// 3. Componentes de Rota (Guardas de Segurança)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRoute from "./components/auth/AuthRoute";

// 4. Todas as Páginas da Aplicação
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EstablishmentsPage from "./pages/EstablishmentsPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import PricingPage from "./pages/PricingPage";
import NewEstablishmentPage from "./pages/NewEstablishmentPage";
import CheckoutPage from "./pages/CheckoutPage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";

// Estilos Globais
import "./styles/global.css";

function App() {
  return (
    // Os Provedores envolvem toda a aplicação para que os seus contextos
    // (notificações, utilizador logado) estejam disponíveis em todo o lado.
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Grupo de Rotas Públicas - Utilizam o MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/establishments" element={<EstablishmentsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/map" element={<MapPage />} />
            </Route>

            {/* Grupo de Rotas de Autenticação - Apenas para utilizadores deslogados */}
            <Route
              element={
                <AuthRoute>
                  <AuthLayout />
                </AuthRoute>
              }
            >
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Adicionar rota para /reset-password aqui no futuro */}
            </Route>

            {/* Grupo de Rotas Protegidas - Apenas para utilizadores logados */}
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

            {/* Rota "Catch-All" para páginas não encontradas (404) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;

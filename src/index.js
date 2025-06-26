// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";

// Importações de Estilos
import "leaflet/dist/leaflet.css"; // <-- ADICIONE ESTA LINHA AQUI
import "./index.css";

// Importações de Componentes e Contextos
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);

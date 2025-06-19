// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext"; // 1. Importar o Provedor!

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* 2. Envolver o <App /> com o <AuthProvider> */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

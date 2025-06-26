// src/components/layout/MainLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./MainLayout.css"; // Criaremos este arquivo a seguir

function MainLayout() {
  return (
    <div className="main-layout-container">
      <Header />
      <main className="main-content">
        {/*
          O <Outlet> é um placeholder mágico do React Router.
          Ele renderiza aqui o componente da rota filha que corresponde à URL atual.
        */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;

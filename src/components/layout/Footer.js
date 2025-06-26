// src/components/layout/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Criaremos este arquivo a seguir

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/about">Sobre Nós</Link>
          <Link to="/terms">Termos de Uso</Link>
          <Link to="/privacy">Política de Privacidade</Link>
          <Link to="/contact">Contato</Link>
        </div>
        <div className="footer-copyright">
          <p>© {currentYear} PPtem. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

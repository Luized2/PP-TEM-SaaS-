import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";
import "./CheckoutPage.css";

// Dados dos planos, idealmente viriam de uma fonte central, mas aqui para simplicidade
const planDetails = {
  pro: {
    name: "Plano Pro",
    price: "R$49,00",
    frequency: "/mês",
    features: [
      "Até 5 estabelecimentos",
      "Eventos ilimitados",
      "Notificações para seguidores",
      "Dashboard com estatísticas básicas",
    ],
  },
  business: {
    name: "Plano Business",
    price: "Contato",
    frequency: "",
    features: [
      "Estabelecimentos ilimitados",
      "Gestão de múltiplos utilizadores",
      "API de integração",
      "Relatórios avançados",
      "Gestor de conta dedicado",
    ],
  },
};

function CheckoutPage() {
  const { planId } = useParams(); // Pega o ID do plano da URL (ex: 'pro')
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Efeito para carregar os detalhes do plano com base no ID da URL
  useEffect(() => {
    const selectedPlan = planDetails[planId];
    if (selectedPlan) {
      setPlan(selectedPlan);
    } else {
      // Se o plano não existir, redireciona para uma página de erro ou de volta para os planos
      navigate("/not-found");
    }
  }, [planId, navigate]);

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");

    console.log(
      `Iniciando checkout para o plano '${planId}' para o utilizador ${currentUser.uid}...`
    );

    // --- LÓGICA SIMULADA ---
    // No futuro, aqui chamaríamos uma Cloud Function:
    // const { data } = await createCheckoutSession({ planId: planId, userId: currentUser.uid });
    // window.location.href = data.stripeCheckoutUrl;

    // Simulação de uma chamada de API com um atraso
    setTimeout(() => {
      try {
        // Simulação de sucesso
        console.log(
          "Sessão de checkout do Stripe criada com sucesso (simulação)."
        );
        alert(
          "Você seria redirecionado para a página de pagamento do Stripe agora!"
        );
        // Em um caso real, o redirecionamento aconteceria acima
        setLoading(false);
      } catch (e) {
        // Simulação de erro
        setError(
          "Não foi possível iniciar o processo de pagamento. Tente novamente."
        );
        setLoading(false);
      }
    }, 2000);
  };

  if (!plan) {
    // Mostra um spinner enquanto os detalhes do plano são carregados
    return <Spinner />;
  }

  return (
    <div className="checkout-container">
      <h1>Finalizar Assinatura</h1>
      <p>Revise os detalhes do seu plano e confirme o pagamento.</p>

      {error && <Alert type="danger" message={error} />}

      <div className="checkout-grid">
        <div className="plan-summary">
          <Card>
            <Card.Header>
              <h3>Resumo do Plano</h3>
            </Card.Header>
            <Card.Body>
              <div className="summary-item">
                <span>Plano</span>
                <strong>{plan.name}</strong>
              </div>
              <div className="summary-item">
                <span>Preço</span>
                <strong>
                  {plan.price}
                  {plan.frequency}
                </strong>
              </div>
              <ul className="summary-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </Card.Body>
            <Card.Footer>
              <div className="summary-total">
                <span>Total a Pagar</span>
                <strong>{plan.price}</strong>
              </div>
            </Card.Footer>
          </Card>
        </div>

        <div className="payment-details">
          <Card>
            <Card.Header>
              <h3>Informações de Pagamento</h3>
            </Card.Header>
            <Card.Body>
              <p>
                Você será redirecionado para o nosso parceiro de pagamentos
                seguro, o Stripe, para concluir a sua compra.
              </p>
              <p>
                Todas as suas informações de cartão de crédito são processadas
                de forma segura e nunca são armazenadas nos nossos servidores.
              </p>
              <div className="secure-payment-badge">
                <span>🔒 Pagamento Seguro</span>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                onClick={handleConfirmPayment}
                loading={loading}
                className="w-100"
              >
                {loading ? "A processar..." : `Confirmar e ir para Pagamento`}
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
      <div className="back-link">
        <Link to="/pricing">← Voltar e escolher outro plano</Link>
      </div>
    </div>
  );
}

export default CheckoutPage;

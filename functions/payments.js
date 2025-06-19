const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Garante que o app do admin seja inicializado
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// Carrega a chave secreta do Stripe da configuração
let stripe;
try {
  const stripeSecretKey = functions.config().stripe.secret_key;
  if (!stripeSecretKey) {
    throw new Error("Chave secreta do Stripe não configurada.");
  }
  stripe = require("stripe")(stripeSecretKey);
} catch (error) {
  console.error("Erro ao inicializar Stripe SDK:", error);
}

/**
 * Cria uma sessão de checkout do Stripe para um usuário.
 */
exports.createCheckoutSession = functions
    .region("southamerica-east1")
    .https.onCall(async (data, context) => {
      if (!stripe) {
        console.error("Stripe não inicializado.");
        throw new functions.https.HttpsError(
            "internal",
            "Erro interno do servidor.",
        );
      }

      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Autenticação necessária.",
        );
      }

      const userId = context.auth.uid;
      const {priceId} = data;

      if (!priceId) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "O ID do preço é obrigatório.",
        );
      }

      try {
        const userRef = db.collection("users").doc(userId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          throw new functions.https.HttpsError(
              "not-found",
              "Usuário não encontrado.",
          );
        }

        const userData = userSnap.data();
        let customerId = userData.stripeCustomerId;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: userData.email,
            name: userData.displayName,
            metadata: {firebaseUserId: userId},
          });
          customerId = customer.id;
          await userRef.update({stripeCustomerId: customerId});
        }

        const successUrl = process.env.FRONTEND_URL ?
        `${process.env.FRONTEND_URL}
        /pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}` :
        "http://localhost:3000/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}";
        const cancelUrl = process.env.FRONTEND_URL ?
        `${process.env.FRONTEND_URL}/pagamento/cancelado` :
        "http://localhost:3000/pagamento/cancelado";

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          customer: customerId,
          line_items: [{price: priceId, quantity: 1}],
          mode: "subscription",
          allow_promotion_codes: true,
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {firebaseUserId: userId},
        });

        return {sessionId: session.id};
      } catch (error) {
        console.error(`Erro em createCheckoutSession para ${userId}:`, error);
        throw new functions.https.HttpsError(
            "internal",
            "Erro ao criar sessão de checkout.",
        );
      }
    });

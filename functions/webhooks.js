const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

let stripe;
let webhookSecret;
try {
  const stripeSecretKey = functions.config().stripe.secret_key;
  webhookSecret = functions.config().stripe.webhook_secret;
  if (!stripeSecretKey || !webhookSecret) {
    throw new Error("Chave secreta ou segredo do webhook não configurados.");
  }
  stripe = require("stripe")(stripeSecretKey);
} catch (error) {
  console.error("Erro ao inicializar Stripe/Webhook:", error);
}

/**
 * Processa eventos de webhook recebidos do Stripe para gerenciar assinaturas.
 * @param {functions.https.Request} req O objeto de requisição HTTP.
 * @param {functions.Response} res O objeto de resposta HTTP.
 * @returns {Promise<void>}
 */
exports.stripeWebhook = functions
    .region("southamerica-east1")
    .https.onRequest(async (req, res) => {
      if (!stripe || !webhookSecret) {
        console.error("Stripe ou webhookSecret não inicializado.");
        return res.status(500).send("Erro interno do servidor.");
      }

      const signature = req.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            webhookSecret,
        );
      } catch (err) {
        console.error("⚠️ Erro na verificação da assinatura do webhook.", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object;
            const userId = session.metadata.firebaseUserId;
            const subscriptionId = session.subscription;
            if (userId && subscriptionId) {
              await db
                  .collection("users")
                  .doc(userId)
                  .update({stripeSubscriptionId: subscriptionId});
            }
            break;
          }
          case "invoice.paid": {
            const invoice = event.data.object;
            await updateSubscriptionStatus(invoice.subscription, "active");
            break;
          }
          case "invoice.payment_failed": {
            const invoice = event.data.object;
            await updateSubscriptionStatus(invoice.subscription, "past_due");
            break;
          }
          case "customer.subscription.updated": {
            const subscription = event.data.object;
            await updateSubscriptionStatus(
                subscription.id,
                subscription.status,
                subscription.items.data[0]?.price.id,
            );
            break;
          }
          case "customer.subscription.deleted": {
            const subscription = event.data.object;
            await updateSubscriptionStatus(subscription.id, "canceled");
            break;
          }
          default:
            console.log(`Evento não tratado: ${event.type}`);
        }
        res.status(200).send({received: true});
      } catch (error) {
        console.error("Erro ao processar o webhook:", error);
        res.status(500).send({error: `Erro interno: ${error.message}`});
      }
    });

/**
 * Encontra o usuário pelo ID da assinatura do Stripe e atualiza
 * seu status no Firestore.
 * @param {string} subscriptionId O ID da assinatura no Stripe.
 * @param {string} newStatus O novo status da assinatura
 * (ex: 'active', 'canceled').
 * @param {string|null} priceId O ID do plano (preço) no Stripe, se aplicável.
 * @return {Promise<void>}
 */
async function updateSubscriptionStatus(
    subscriptionId,
    newStatus,
    priceId = null,
) {
  if (!subscriptionId) return;

  const usersRef = db.collection("users");
  const snapshot = await usersRef
      .where("stripeSubscriptionId", "==", subscriptionId)
      .limit(1)
      .get();

  if (snapshot.empty) {
    console.error(
        `Nenhum usuário encontrado para subscriptionId: ${subscriptionId}`,
    );
    return;
  }

  const userDoc = snapshot.docs[0];
  const updateData = {
    "subscription.status": newStatus,
    "subscription.updatedAt": admin.firestore.FieldValue.serverTimestamp(),
  };

  if (newStatus === "active" && priceId) {
    const plan = getPlanFromPriceId(priceId);
    if (plan) {
      updateData["subscription.plan"] = plan.name;
      updateData["subscription.features"] = plan.features;
    }
  } else if (["canceled", "past_due", "unpaid"].includes(newStatus)) {
    updateData["subscription.plan"] = "free";
    updateData["subscription.features"] = {};
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription && subscription.current_period_end) {
      updateData["subscription.currentPeriodEnd"] =
        admin.firestore.Timestamp.fromMillis(
            subscription.current_period_end * 1000,
        );
    }
  } catch (stripeError) {
    console.error(
        `Erro ao buscar detalhes da assinatura ${subscriptionId} no Stripe:`,
        stripeError,
    );
  }

  await userDoc.ref.update(updateData);
}

/**
 * Mapeia um ID de Preço do Stripe para um objeto de plano interno da aplicação.
 * @param {string} priceId O ID do preço do Stripe.
 * @return {object|null} O objeto do plano correspondentes
 * ou nulo se não encontrado.
 */
function getPlanFromPriceId(priceId) {
  // Mantenha isso sincronizado com seus IDs de preço reais no Stripe
  const plans = {
    "price_...pro_monthly": {
      name: "pro",
      features: {maxEstablishments: 5, reports: "basic"},
    },
    "price_...pro_yearly": {
      name: "pro",
      features: {maxEstablishments: 5, reports: "basic"},
    },
    "price_...business_monthly": {
      name: "business",
      features: {maxEstablishments: Infinity, reports: "advanced"},
    },
    "price_...business_yearly": {
      name: "business",
      features: {maxEstablishments: Infinity, reports: "advanced"},
    },
  };
  return plans[priceId] || null;
}

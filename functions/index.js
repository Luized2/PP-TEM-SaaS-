const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

/**
 * Função acionada quando um novo usuário é criado no Firebase Authentication.
 * Cria um documento correspondente na coleção 'users' do Firestore.
 */
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`Novo usuário criado no Auth: ${user.uid}, Email: ${user.email}`);

  const userDocRef = db.collection('users').doc(user.uid);

  const newUserProfileData = {
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || 'Novo Usuário',
    photoURL: user.photoURL || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    role: 'consumer',
    preferences: {
      notifications: { emailEnabled: true, pushEnabled: true },
      favoriteCategories: [],
      searchRadiusKm: 10,
      theme: 'system'
    },
    isActive: true,
  };

  try {
    await userDocRef.set(newUserProfileData);
    functions.logger.info(`Perfil criado no Firestore para ${user.uid}`);
    return null;
  } catch (error) {
    functions.logger.error(`Erro ao criar perfil no Firestore para ${user.uid}:`, error);
    throw new functions.https.HttpsError('internal', 'Falha ao criar perfil de usuário.');
  }
});

/**
 * Função acionada quando um usuário é excluído do Firebase Authentication.
 * Remove o documento correspondente na coleção 'users' do Firestore.
 */
exports.deleteUserProfile = functions.auth.user().onDelete(async (user) => {
  functions.logger.info(`Usuário excluído do Auth: ${user.uid}`);

  const userDocRef = db.collection('users').doc(user.uid);

  try {
    await userDocRef.delete();
    functions.logger.info(`Perfil excluído do Firestore para ${user.uid}`);
    // TODO Futuro: Adicionar lógica para limpar outros dados relacionados
    return null;
  } catch (error) {
    functions.logger.error(`Erro ao excluir perfil do Firestore para ${user.uid}:`, error);
    throw new functions.https.HttpsError('internal', 'Falha ao excluir perfil de usuário.');
  }
});

// Importar e exportar outras funções
const payments = require('./payments'); // Supondo que o arquivo payments.js exista
const webhooks = require('./webhooks'); // Supondo que o arquivo webhooks.js exista

exports.createCheckoutSession = payments.createCheckoutSession;
exports.stripeWebhook = webhooks.stripeWebhook;
// functions/index.js - VERSÃO ORIGINAL COM SINTAXE V1

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

/**
 * Função acionada quando um novo usuário é criado no Firebase Authentication.
 */
exports.createUserProfile = functions
    .region("southamerica-east1")
    .auth.user()
    .onCreate(async (user) => {
      functions.logger.info(
          `Novo usuário criado no Auth: ${user.uid}, Email: ${user.email}`,
      );
      try {
        const userDocRef = db.collection("users").doc(user.uid);
        const newUserProfileData = {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || "Novo Usuário",
          photoURL: user.photoURL || null,
          createdAt: FieldValue.serverTimestamp(),
          role: "consumer",
          preferences: {
            notifications: {emailEnabled: true, pushEnabled: true},
            favoriteCategories: [],
            searchRadiusKm: 10,
            theme: "system",
          },
          isActive: true,
        };
        await userDocRef.set(newUserProfileData);
        functions.logger.info(`Perfil criado no Firestore para ${user.uid}`);
        return null;
      } catch (error) {
        functions.logger.error(
            `Erro ao criar perfil no Firestore para ${user.uid}:`,
            error,
        );
        throw new functions.https.HttpsError(
            "internal",
            "Falha ao criar perfil de usuário.",
        );
      }
    });

/**
 * Função acionada quando um usuário é EXCLUÍDO do Firebase Authentication.
 */
exports.deleteUserProfile = functions
    .region("southamerica-east1")
    .auth.user()
    .onDelete(async (user) => {
      functions.logger.info(
          `Usuário excluídodoAuth: ${user.uid}, preparando para limpar perfil.`,
      );
      const userDocRef = db.collection("users").doc(user.uid);
      try {
        await userDocRef.delete();
        functions.logger.info(`Perfil excluído do Firestore para ${user.uid}`);
        return null;
      } catch (error) {
        functions.logger.error(
            `Erro ao excluir perfil do Firestore para ${user.uid}:`,
            error,
        );
        throw new functions.https.HttpsError(
            "internal",
            "Falha ao excluir perfil de usuário.",
        );
      }
    });

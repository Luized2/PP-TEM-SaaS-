// src/services/firebase.js
// Este arquivo configura e inicializa o Firebase no seu aplicativo React.

// 1. Importar as "ferramentas" necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// 2. Montar o objeto de configuração lendo as chaves do .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID, // Opcional, mas recomendado para Analytics
};

// 3. (Opcional, mas recomendado) Validar se as chaves foram carregadas
if (!firebaseConfig.apiKey) {
  throw new Error(
    "Erro: Configuração do Firebase não encontrada. Verifique suas variáveis de ambiente (.env)."
  );
}

// 4. Inicializar o App Firebase com as configurações
const app = initializeApp(firebaseConfig);

// 5. Obter "atalhos" para cada serviço que vamos usar
const auth = getAuth(app); // Serviço de Autenticação
const db = getFirestore(app); // Serviço do Firestore (Banco de Dados)
const storage = getStorage(app); // Serviço do Cloud Storage (Arquivos)
const functions = getFunctions(app); // Serviço do Cloud Functions

// 6. Exportar os atalhos para serem usados em qualquer lugar do app
export { app, auth, db, storage, functions };

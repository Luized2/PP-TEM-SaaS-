// src/contexts/AuthContext.js
// (Versão final após o Dia 30)

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  // signOut, // Importaremos depois
  // sendPasswordResetEmail, // Importaremos depois
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Funções de Auth já implementadas
  async function register(email, password, displayName) {
    /* ...código do register... */
  }
  async function login(email, password) {
    /* ...código do login... */
  }
  async function loginWithGoogle() {
    /* ...código do loginWithGoogle... */
  }

  async function updateUserProfile(data) {
    setError("");
    if (!currentUser)
      throw new Error("Nenhum usuário logado para atualizar o perfil.");

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const firestoreUpdateData = { ...data, updatedAt: serverTimestamp() };
      delete firestoreUpdateData.email;
      delete firestoreUpdateData.uid;
      delete firestoreUpdateData.createdAt;
      delete firestoreUpdateData.role;
      await updateDoc(userDocRef, firestoreUpdateData);

      const authUpdateData = {};
      if (data.displayName !== undefined)
        authUpdateData.displayName = data.displayName;
      if (data.photoURL !== undefined)
        authUpdateData.photoURL = data.photoURL || null;
      if (Object.keys(authUpdateData).length > 0) {
        await updateProfile(currentUser, authUpdateData);
      }

      setUserProfile((prev) => ({
        ...prev,
        ...firestoreUpdateData,
        updatedAt: new Date(),
      }));
      return true;
    } catch (err) {
      setError("Ocorreu um erro ao atualizar seu perfil.");
      throw err;
    }
  }

  // Placeholders para as funções restantes
  // async function logout() {}
  // async function resetPassword(email) {}

  useEffect(() => {
    /* ...código robusto do useEffect do Dia 26... */
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    setError,
    register,
    login,
    loginWithGoogle,
    updateUserProfile,
    // logout,
    // resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

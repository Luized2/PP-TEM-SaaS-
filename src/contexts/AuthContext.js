import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
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

  async function register(email, password, displayName) {
    setError("");
    if (!email || !password || !displayName) {
      const errorMsg = "Email, senha e nome são obrigatórios.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      const userDocRef = doc(db, "users", user.uid);
      const newUserProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        role: "consumer",
        preferences: {
          notifications: { emailEnabled: true, pushEnabled: true },
          favoriteCategories: [],
          searchRadiusKm: 10,
          theme: "system",
        },
        isActive: true,
      };
      await setDoc(userDocRef, newUserProfileData);
      return user;
    } catch (err) {
      //... (tratamento de erro detalhado)
      throw err;
    }
  }

  async function login(email, password) {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { lastLoginAt: serverTimestamp() });
      return user;
    } catch (err) {
      //... (tratamento de erro detalhado)
      throw err;
    }
  }

  async function loginWithGoogle() {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        const newUserProfileData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Usuário Google",
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          role: "consumer",
          preferences: {
            /* ... */
          },
          isActive: true,
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newUserProfileData);
      } else {
        await updateDoc(userDocRef, { lastLoginAt: serverTimestamp() });
      }
      return user;
    } catch (err) {
      //... (tratamento de erro detalhado)
      throw err;
    }
  }

  async function logout() {
    setError("");
    try {
      await signOut(auth);
    } catch (err) {
      setError("Ocorreu um erro ao tentar deslogar.");
      throw err;
    }
  }

  async function resetPassword(email) {
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      //... (tratamento de erro detalhado)
      throw err;
    }
  }

  async function updateUserProfile(data) {
    setError("");
    if (!currentUser) throw new Error("Nenhum usuário logado.");
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const firestoreUpdateData = { ...data, updatedAt: serverTimestamp() };
      //... (remover campos imutáveis)
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            //... (tratamento de perfil não encontrado)
          }
        } catch (err) {
          //... (tratamento de erro ao carregar perfil)
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
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
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

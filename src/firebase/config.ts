// --- Configuración de Firebase optimizada para React Native + Expo ---
//
// Puntos importantes:
// 1. Se usa initializeAuth con getReactNativePersistence para mantener la sesión guardada
//    en el almacenamiento local (AsyncStorage).
// 2. Este archivo se ejecuta una sola vez para evitar errores de inicialización múltiple.
// 3. Usa variables de entorno de Expo (process.env.EXPO_PUBLIC_...)

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuración del proyecto (usando las variables de entorno)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

// Inicializa la app solo si no existe
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

// --- Autenticación con persistencia nativa ---
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Si ya fue inicializado (por hot reload), simplemente lo obtenemos
  auth = getAuth(app);
}

// Firestore
export const db = getFirestore(app);

export { app, auth };

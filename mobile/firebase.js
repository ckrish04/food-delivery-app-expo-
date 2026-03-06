import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these placeholder values with your Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyD7ZdIEZXTm2qIt5GWHE3Q3LTTzWsnTJrs",
  authDomain: "authentication-66af6.firebaseapp.com",
  projectId: "authentication-66af6",
  storageBucket: "authentication-66af6.firebasestorage.app",
  messagingSenderId: "212486106869",
  appId: "1:212486106869:web:6cf595f54a2b56201b9fbc",
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.trim() && !value.includes("YOUR_FIREBASE_")
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

export { app, auth, db, isFirebaseConfigured };

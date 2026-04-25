// Firebase core
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* ===============================
   Firebase Config
=============================== */
const firebaseConfig = {
  apiKey: "AIzaSyCNbGNyMcKkoci3bO8AV6WA_WU4PYBLKpM",
  authDomain: "testing-2f80b.firebaseapp.com",
  projectId: "testing-2f80b",
  storageBucket: "testing-2f80b.firebasestorage.app",
  messagingSenderId: "1026082238888",
  appId: "1:1026082238888:web:98c7073345f52bf95fed9d",
};

/* ===============================
   INIT APP (prevent duplicates)
=============================== */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/* ===============================
   SERVICES
=============================== */
export const auth = getAuth(app);
export const db = getFirestore(app);
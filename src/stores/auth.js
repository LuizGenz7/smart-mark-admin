import { create } from "zustand";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { fetchUser } from "../utils/fetchUser";

/* ===============================
   STORE
=============================== */
export const useAuth = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  /* ===============================
     ERROR HANDLING
  =============================== */
  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),

  /* ===============================
     INIT (READ LOCALSTORAGE)
  =============================== */
  init: async () => {
    try {
      const stored = localStorage.getItem("auth-storage");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (parsed?.state?.user) {
          set({ user: parsed.state.user });
        }
      }

    } catch (e) {
      console.error("Init error:", e);
    } finally {
      set({ initialized: true });
    }
  },

  /* ===============================
     LOGIN
  =============================== */
 login: async (email, password) => {
  try {
    set({ loading: true, error: null });

    const { user } = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const profile = await fetchUser(user.uid);

    // ✅ ADMIN VALIDATION (IMPORTANT)
    if (!profile) {
      await signOut(auth);
      throw new Error("Not an admin");
    }

    set({ user: profile, loading: false });

    localStorage.setItem(
      "auth-storage",
      JSON.stringify({
        state: { user: profile },
      })
    );

    return profile;
  } catch (e) {
    set({ loading: false, error: e.message });
    throw e;
  }
},

  /* ===============================
     LOGOUT
  =============================== */
  logout: async () => {
    try {
      set({ loading: true, error: null });

      await signOut(auth);

      set({ user: null, loading: false });

      localStorage.removeItem("auth-storage");
    } catch (e) {
      set({ loading: false, error: e.message });
    }
  },

  /* ===============================
     AUTH LISTENER
  =============================== */
  watchAuth: () => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await fetchUser(firebaseUser.uid);
          set({ user: profile });

          localStorage.setItem(
            "auth-storage",
            JSON.stringify({
              state: { user: profile },
            })
          );
        } else {
          set({ user: null });
          localStorage.removeItem("auth-storage");
        }
      } catch (e) {
        set({ error: "Auth error: " + e.message });
      }
    });
  },
}));
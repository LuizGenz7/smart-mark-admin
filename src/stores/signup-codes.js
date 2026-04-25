import { create } from "zustand";
import {
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";

const CACHE_KEY = "signup-codes-cache";

// 🔥 helper
const buildMap = (data = []) => {
  const map = {};
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    map[c.id] = c;
  }
  return map;
};

const useSignupCodeStore = create((set, get) => {
  const cache = {
    get: () => {
      try {
        const data = localStorage.getItem(CACHE_KEY);
        return data ? JSON.parse(data) : { codes: [] };
      } catch {
        return { codes: [] };
      }
    },
    set: (codes) => {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ codes })
        );
      } catch {}
    },
  };

  return {
    // ✅ STATE
    codes: [],
    codeMap: {},
    loading: false,
    error: null,
    unsubscribe: null,

    // 🔥 LOAD CACHE
    useCachedCodes: () => {
      try {
        set({ loading: true, error: null });

        const cached = cache.get();

        set({
          codes: cached.codes,
          codeMap: buildMap(cached.codes),
          loading: false,
        });

        return cached;
      } catch {
        set({
          loading: false,
          error: "Failed to load cache",
        });
      }
    },

    // 🔥 LISTENER
    listenToSignupCodes: (schoolId, isOnline = true) => {
      try {
        if (!schoolId) throw new Error("Missing schoolId");

        // 🛑 stop previous
        const prev = get().unsubscribe;
        if (typeof prev === "function") prev();

        set({ unsubscribe: null, loading: true, error: null });

        // ⚡ load cache first
        const cached = cache.get();
        if (cached.codes?.length) {
          set({
            codes: cached.codes,
            codeMap: buildMap(cached.codes),
            loading: false,
          });
        }

        // 📴 offline
        if (!isOnline) {
          set({ loading: false });
          return;
        }

        const schoolRef = doc(db, "schools", schoolId);

        const unsubscribe = onSnapshot(
          schoolRef,
          (snapshot) => {
            try {
              if (!snapshot.exists()) {
                set({
                  codes: [],
                  codeMap: {},
                  loading: false,
                  error: "School not found",
                });

                cache.set([]);
                return;
              }

              // 🔥 read signupCodes instead of classes
              const codes = snapshot.data()?.signupCodes || [];

              const map = buildMap(codes);

              set({
                codes,
                codeMap: map,
                loading: false,
                error: null,
              });

              cache.set(codes);
            } catch {}
          },
          () => {
            const cached = cache.get();

            set({
              codes: cached.codes,
              codeMap: buildMap(cached.codes),
              loading: false,
              error: "Realtime failed, using cache",
            });
          }
        );

        set({ unsubscribe });
      } catch (error) {
        const cached = cache.get();

        set({
          codes: cached.codes,
          codeMap: buildMap(cached.codes),
          loading: false,
          error: error.message || "Something went wrong",
        });
      }
    },

    // ➕ ADD CODE
    addSignupCode: async (schoolId, code) => {
      try {
        if (!code || !schoolId) return;

        const codeObj = {
          id: code,
          code,
          createdAt: serverTimestamp(),
        };

        // 1️⃣ subcollection
        await setDoc(
          doc(db, "schools", schoolId, "signupCodes", code),
          codeObj
        );

        // 2️⃣ array in school doc
        const schoolRef = doc(db, "schools", schoolId);
        const snap = await getDoc(schoolRef);

        if (!snap.exists()) return;

        const existing = snap.data().signupCodes || [];

        const exists = existing.some(
          (c) => (c.id || c.code) === code
        );

        if (!exists) {
          await updateDoc(schoolRef, {
            signupCodes: [...existing, { id: code, code }],
          });
        }
      } catch (err) {
        console.error("Add code failed:", err);
        set({ error: err.message });
      }
    },

    // ❌ DELETE CODE
    deleteSignupCode: async (schoolId, codeId) => {
      try {
        if (!schoolId || !codeId) return;

        // 1️⃣ subcollection
        await deleteDoc(
          doc(db, "schools", schoolId, "signupCodes", codeId)
        );

        // 2️⃣ array
        const schoolRef = doc(db, "schools", schoolId);
        const snap = await getDoc(schoolRef);

        if (!snap.exists()) return;

        const existing = snap.data().signupCodes || [];

        const updated = existing.filter(
          (c) => (c.id || c.code) !== codeId
        );

        await updateDoc(schoolRef, {
          signupCodes: updated,
        });
      } catch (err) {
        console.error("Delete code failed:", err);
        set({ error: err.message });
      }
    },

    // 🛑 STOP
    stopListening: () => {
      const unsub = get().unsubscribe;
      if (typeof unsub === "function") unsub();

      set({
        unsubscribe: null,
        codes: [],
        codeMap: {},
      });
    },
  };
});

export default useSignupCodeStore;
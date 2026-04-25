import { create } from "zustand";
import {
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../services/firebase";

const CACHE_KEY = "terms-cache";

// 🔥 helper
const buildMap = (data = []) => {
  const map = {};
  for (let i = 0; i < data.length; i++) {
    const t = data[i];
    map[t.id] = t;
  }
  return map;
};

const useTermStore = create((set, get) => {
  const cache = {
    get: () => {
      try {
        const data = localStorage.getItem(CACHE_KEY);
        return data ? JSON.parse(data) : { terms: [] };
      } catch {
        return { terms: [] };
      }
    },
    set: (terms) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ terms }));
      } catch {}
    },
  };

  return {
    // ================= STATE =================
    terms: [],
    termMap: {},
    activeTerm: null,

    loading: false,
    error: null,

    unsubscribe: null,
    unsubscribeActive: null,

    // ================= CACHE =================
    useCachedTerms: () => {
      try {
        set({ loading: true, error: null });

        const cached = cache.get();

        set({
          terms: cached.terms,
          termMap: buildMap(cached.terms),
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

    // ================= LISTENERS =================
    listenToTerms: (schoolId, isOnline = true) => {
       
      try {
        if (!schoolId) throw new Error("Missing schoolId");

        // 🛑 stop previous listeners
        const prev = get().unsubscribe;
        const prevActive = get().unsubscribeActive;

        if (typeof prev === "function") prev();
        if (typeof prevActive === "function") prevActive();

        set({
          unsubscribe: null,
          unsubscribeActive: null,
          loading: true,
          error: null,
        });

        // ⚡ cache first
        const cached = cache.get();
        if (cached.terms?.length) {
          set({
            terms: cached.terms,
            termMap: buildMap(cached.terms),
            loading: false,
          });
        }

        if (!isOnline) {
          set({ loading: false });
          return;
        }

        const endedRef = doc(
          db,
          "schools",
          schoolId,
          "config",
          "endedTerms"
        );

        const activeRef = doc(
          db,
          "schools",
          schoolId,
          "config",
          "activeTerm"
        );

        // 📚 endedTerms listener
        const unsubTerms = onSnapshot(
          endedRef,
          (snapshot) => {
            
            try {
              if (!snapshot.exists()) {
                set({ terms: [], termMap: {} });
                cache.set([]);
                return;
              }

              const terms = snapshot.data()?.terms || [];

               


              set({
                terms,
                termMap: buildMap(terms),
                loading: false,
              });

              cache.set(terms);
            } catch {}
          },
          () => {
            const cached = cache.get();

            set({
              terms: cached.terms,
              termMap: buildMap(cached.terms),
              loading: false,
              error: "Realtime failed (terms), using cache",
            });
          }
        );

        // 🟢 activeTerm listener
        const unsubActive = onSnapshot(
          activeRef,
          (snapshot) => {
            try {
              if (!snapshot.exists()) {
                set({ activeTerm: null });
                return;
              }

              set({
                activeTerm: snapshot.data(),
              });
            } catch {}
          },
          () => {
            set({
              activeTerm: null,
              error: "Realtime failed (active term)",
            });
          }
        );

        set({
          unsubscribe: unsubTerms,
          unsubscribeActive: unsubActive,
        });
      } catch (error) {
        const cached = cache.get();

        set({
          terms: cached.terms,
          termMap: buildMap(cached.terms),
          loading: false,
          error: error.message || "Something went wrong",
        });
      }
    },

    // ================= ACTIVE TERM =================
    setActiveTerm: async (schoolId, termObj) => {
      try {
        if (!schoolId || !termObj?.id) return;

        const activeRef = doc(
          db,
          "schools",
          schoolId,
          "config",
          "activeTerm"
        );

        // 🔥 auto-end previous active term
        const snap = await getDoc(activeRef);

        if (snap.exists()) {
          await get().endActiveTerm(schoolId);
        }

        await setDoc(
          activeRef,
          {
            ...termObj,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Set active term failed:", err);
        set({ error: err.message });
      }
    },

    // ================= END ACTIVE TERM =================
    endActiveTerm: async (schoolId) => {
      try {
        if (!schoolId) return;

        const activeRef = doc(
          db,
          "schools",
          schoolId,
          "config",
          "activeTerm"
        );

        const endedRef = doc(
          db,
          "schools",
          schoolId,
          "config",
          "endedTerms"
        );

        const activeSnap = await getDoc(activeRef);
        if (!activeSnap.exists()) return;

        const activeTerm = activeSnap.data();
        if (!activeTerm?.id) return;

        const endedSnap = await getDoc(endedRef);

        const existing = endedSnap.exists()
          ? endedSnap.data().terms || []
          : [];

        const exists = existing.some(
          (t) => t.id === activeTerm.id
        );

        let updated = existing;

        if (!exists) {
          updated = [
            {
              ...activeTerm,
            },
            ...existing,
          ];
        }

        await setDoc(
          endedRef,
          { terms: updated },
          { merge: true }
        );

        await deleteDoc(activeRef);
      } catch (err) {
        console.error("End active term failed:", err);
        set({ error: err.message });
      }
    },

    // ================= STOP =================
    stopListening: () => {
      const unsub = get().unsubscribe;
      const unsubActive = get().unsubscribeActive;

      if (typeof unsub === "function") unsub();
      if (typeof unsubActive === "function") unsubActive();

      set({
        unsubscribe: null,
        unsubscribeActive: null,
        terms: [],
        termMap: {},
        activeTerm: null,
      });
    },
  };
});

export default useTermStore;
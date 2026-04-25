import { create } from "zustand";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const CACHE_KEY = "payment-cache";

// 🔥 helper (optional future use if you extend data)
const buildMap = (data = []) => {
  const map = {};
  for (let i = 0; i < data.length; i++) {
    const p = data[i];
    map[p.id] = p;
  }
  return map;
};

const usePaymentStore = create((set, get) => {
  const cache = {
    get: () => {
      try {
        const data = localStorage.getItem(CACHE_KEY);
        return data ? JSON.parse(data) : { payment: null };
      } catch {
        return { payment: null };
      }
    },
    set: (payment) => {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ payment })
        );
      } catch {}
    },
  };

  return {
    // ================= STATE =================
    payment: null,
    loading: false,
    error: null,
    unsubscribe: null,

    // ================= CACHE =================
    useCachedPayment: () => {
      try {
        set({ loading: true, error: null });

        const cached = cache.get();

        set({
          payment: cached.payment,
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

    // ================= LISTENER =================
    listenToPayment: (schoolId, isOnline = true) => {
      try {
        if (!schoolId) throw new Error("Missing schoolId");

        // 🛑 stop previous
        const prev = get().unsubscribe;
        if (typeof prev === "function") prev();

        set({
          unsubscribe: null,
          loading: true,
          error: null,
        });

        // ⚡ cache first
        const cached = cache.get();
        if (cached.payment) {
          set({
            payment: cached.payment,
            loading: false,
          });
        }

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
                  payment: null,
                  loading: false,
                  error: "School not found",
                });

                cache.set(null);
                return;
              }

              const data = snapshot.data();

              const payment = {
                name: data?.name || "",
                isDeactivated: data?.isDeactivated || false,
                paymentDue: data?.paymentDue || null,
                paymentStart: data?.paymentStart || null,
              };

              set({
                payment,
                loading: false,
                error: null,
              });

              cache.set(payment);
            } catch {}
          },
          () => {
            const cached = cache.get();

            set({
              payment: cached.payment,
              loading: false,
              error: "Realtime failed, using cache",
            });
          }
        );

        set({ unsubscribe });
      } catch (error) {
        const cached = cache.get();

        set({
          payment: cached.payment,
          loading: false,
          error: error.message || "Something went wrong",
        });
      }
    },

    // ================= STOP =================
    stopListening: () => {
      const unsub = get().unsubscribe;
      if (typeof unsub === "function") unsub();

      set({
        unsubscribe: null,
        payment: null,
      });
    },
  };
});

export default usePaymentStore;
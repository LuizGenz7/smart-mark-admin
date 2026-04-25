import { create } from "zustand";
import { onSnapshot, doc, updateDoc, getDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

import { db } from "../services/firebase";

const CACHE_KEY = "classes-cache";

// 🔥 helper
const buildMap = (data = []) => {
    const map = {};
    for (let i = 0; i < data.length; i++) {
        const c = data[i];
        map[c.id] = c;
    }
    return map;
};

const useClassStore = create((set, get) => {
    const cache = {
        get: () => {
            try {
                const data = localStorage.getItem(CACHE_KEY);
                return data ? JSON.parse(data) : { classes: [] };
            } catch {
                return { classes: [] };
            }
        },
        set: (classes) => {
            try {
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({ classes })
                );
            } catch { }
        },
    };

    return {
        // ✅ STATE
        classes: [],
        classMap: {},
        loading: false,
        error: null,
        unsubscribe: null,

        // 🔥 LOAD CACHE FIRST
        useCachedClasses: () => {
            try {
                set({ loading: true, error: null });

                const cached = cache.get();

                set({
                    classes: cached.classes,
                    classMap: buildMap(cached.classes),
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
        listenToClasses: (schoolId, isOnline = true) => {
            try {
                if (!schoolId) throw new Error("Missing schoolId");

                // 🛑 stop previous listener
                const prev = get().unsubscribe;
                if (typeof prev === "function") prev();

                set({ unsubscribe: null, loading: true, error: null });

                // ⚡ load cache first
                const cached = cache.get();
                if (cached.classes?.length) {
                    set({
                        classes: cached.classes,
                        classMap: buildMap(cached.classes),
                        loading: false,
                    });
                }

                // 📴 offline → stop
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
                                    classes: [],
                                    classMap: {},
                                    loading: false,
                                    error: "School not found",
                                });

                                cache.set([]);
                                return;
                            }

                            // 🔥 ONLY CHANGE IS HERE
                            const classes = snapshot.data()?.classes || [];

                            const map = buildMap(classes);

                            set({
                                classes,
                                classMap: map,
                                loading: false,
                                error: null,
                            });

                            cache.set(classes);
                        } catch { }
                    },
                    () => {
                        // fallback to cache
                        const cached = cache.get();

                        set({
                            classes: cached.classes,
                            classMap: buildMap(cached.classes),
                            loading: false,
                            error: "Realtime failed, using cache",
                        });
                    }
                );

                set({ unsubscribe });
            } catch (error) {
                const cached = cache.get();

                set({
                    classes: cached.classes,
                    classMap: buildMap(cached.classes),
                    loading: false,
                    error: error.message || "Something went wrong",
                });
            }
        },
        addClass: async (schoolId, name) => {
            try {
                if (!name || !schoolId) return;

                const classObj = {
                    id: name,
                    name,
                    createdAt: serverTimestamp(),
                };

                // 1️⃣ Save to subcollection
                await setDoc(
                    doc(db, "schools", schoolId, "classes", name),
                    classObj
                );

                // 2️⃣ Update array in school doc
                const schoolRef = doc(db, "schools", schoolId);
                const snap = await getDoc(schoolRef);

                if (!snap.exists()) return;

                const existingClasses = snap.data().classes || [];

                const alreadyExists = existingClasses.some(
                    (c) => (c.id || c.name) === name
                );

                if (!alreadyExists) {
                    await updateDoc(schoolRef, {
                        classes: [
                            ...existingClasses,
                            { id: name, name },
                        ],
                    });
                }

                // ⚡ no manual set() needed — listener will update UI
            } catch (err) {
                console.error("Add class failed:", err);
                set({ error: err.message });
            }
        },

        deleteClass: async (schoolId, classId) => {
            try {
                if (!schoolId || !classId) return;

                // 1️⃣ Remove from subcollection
                await deleteDoc(
                    doc(db, "schools", schoolId, "classes", classId)
                );

                // 2️⃣ Remove from array in school doc
                const schoolRef = doc(db, "schools", schoolId);
                const snap = await getDoc(schoolRef);

                if (!snap.exists()) return;

                const existingClasses = snap.data().classes || [];

                const updatedClasses = existingClasses.filter(
                    (c) => (c.id || c.name) !== classId
                );

                await updateDoc(schoolRef, {
                    classes: updatedClasses,
                });

                // ⚡ listener handles UI update
            } catch (err) {
                console.error("Delete class failed:", err);
                set({ error: err.message });
            }
        },

        // 🛑 STOP
        stopListening: () => {
            const unsub = get().unsubscribe;
            if (typeof unsub === "function") unsub();

            set({
                unsubscribe: null,
                classes: [],
                classMap: {},
            });
        },
    };
});

export default useClassStore;
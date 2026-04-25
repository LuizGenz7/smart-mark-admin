import { create } from "zustand";
import { onSnapshot, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../services/firebase"; // adjust path

const CACHE_KEY = "teachers-cache";

// 🔥 helper
const buildMap = (data = []) => {
  const map = {};
  for (let i = 0; i < data.length; i++) {
    const t = data[i];
    map[t.id] = t;
  }
  return map;
};

const useTeacherStore = create((set, get) => {
  const cache = {
    get: () => {
      try {
        const data = localStorage.getItem(CACHE_KEY);
        return data ? JSON.parse(data) : { teachers: [] };
      } catch {
        return { teachers: [] };
      }
    },
    set: (teachers) => {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ teachers })
        );
      } catch { }
    },
  };

  return {
    // ✅ STATE
    teachers: [],
    teacherMap: {},
    loading: false,
    error: null,
    unsubscribe: null,

    // 🔥 LOAD CACHE FIRST
    useCachedTeachers: () => {
      try {
        set({ loading: true, error: null });

        const cached = cache.get();

        set({
          teachers: cached.teachers,
          teacherMap: buildMap(cached.teachers),
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
    listenToTeachers: (schoolId, isOnline = true) => {
      try {
        if (!schoolId) throw new Error("Missing schoolId");

        // 🛑 stop previous listener
        const prev = get().unsubscribe;
        if (typeof prev === "function") prev();

        set({ unsubscribe: null, loading: true, error: null });

        // ⚡ load cache first
        const cached = cache.get();
        if (cached.teachers?.length) {
          set({
            teachers: cached.teachers,
            teacherMap: buildMap(cached.teachers),
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
                  teachers: [],
                  teacherMap: {},
                  loading: false,
                  error: "School not found",
                });

                cache.set([]);
                return;
              }

              const teachers = snapshot.data()?.teachers || [];

              const map = buildMap(teachers);

              set({
                teachers,
                teacherMap: map,
                loading: false,
                error: null,
              });

              cache.set(teachers);
            } catch { }
          },
          () => {
            // fallback to cache
            const cached = cache.get();

            set({
              teachers: cached.teachers,
              teacherMap: buildMap(cached.teachers),
              loading: false,
              error: "Realtime failed, using cache",
            });
          }
        );

        set({ unsubscribe });
      } catch (error) {
        const cached = cache.get();

        set({
          teachers: cached.teachers,
          teacherMap: buildMap(cached.teachers),
          loading: false,
          error: error.message || "Something went wrong",
        });
      }
    },

    deleteTeacher: async (schoolId, teacherId) => {
      try {
        if (!schoolId || !teacherId) return;

        // 1️⃣ Remove from subcollection
        await deleteDoc(
          doc(db, "users", teacherId)
        );
        // 2️⃣ Remove from array in school doc
        const schoolRef = doc(db, "schools", schoolId);
        const snap = await getDoc(schoolRef);

        if (!snap.exists()) return;
        

        const existingTeachers = snap.data().teachers || [];

        const updatedTeachers = existingTeachers.filter(
          (t) => (t.uid || t.name) !== teacherId
        );

        await updateDoc(schoolRef, {
          teachers: updatedTeachers,
        });

        // ⚡ listener updates UI automatically
      } catch (err) {
        console.error("Delete teacher failed:", err);
        set({ error: err.message });
      }
    },
    updateTeacherClass: async (schoolId, teacherId, newClassId) => {
      try {
        if (!schoolId || !teacherId || !newClassId) return;


        // 1️⃣ Update in users collection
        const teacherRef = doc(db, "users", teacherId);
        await updateDoc(teacherRef, {
          classId: newClassId,
        });

        // 2️⃣ Update inside school teachers array
        const schoolRef = doc(db, "schools", schoolId);
        const snap = await getDoc(schoolRef);

        if (!snap.exists()) return;

        const existingTeachers = snap.data().teachers || [];

        const updatedTeachers = existingTeachers.map((t) => {
          if (t.uid === teacherId) {
            return {
              ...t,
              classId: newClassId, // 🔥 update class
            };
          }
          return t;
        });


        await updateDoc(schoolRef, {
          teachers: updatedTeachers,
        });
        // ⚡ listener updates UI
      } catch (err) {
        console.error("Update teacher class failed:", err);
        set({ error: err.message });
      }
    },
    // 🛑 STOP
    stopListening: () => {
      const unsub = get().unsubscribe;
      if (typeof unsub === "function") unsub();

      set({
        unsubscribe: null,
        teachers: [],
        teacherMap: {},
      });
    },
  };
});

export default useTeacherStore;
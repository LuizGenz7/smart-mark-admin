import React, { useState, useMemo } from "react";
import { UserIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

import useTeacherStore from "../stores/teachers";
import useClassStore from "../stores/classes";
import { useAuth } from "../stores/auth";
import Empty from "../components/Empty";

const Teachers = () => {
  const user = useAuth((s) => s.user);

  const teachers = useTeacherStore((s) => s.teachers);
  const deleteTeacher = useTeacherStore((s) => s.deleteTeacher);
  const updateTeacherClass = useTeacherStore((s) => s.updateTeacherClass);

  const classes = useClassStore((s) => s.classes);

  // local state for class selection
  const [selectedClass, setSelectedClass] = useState({});

  // 🔥 safer handler
  const handleChange = (teacherId, value) => {
    setSelectedClass((prev) => ({
      ...prev,
      [teacherId]: value,
    }));
  };

  // 🔥 confirm update
  const confirmChange = async (teacherId) => {
    const newClassId = selectedClass[teacherId];

    if (!newClassId || !user?.schoolId) return;

    await updateTeacherClass(user.schoolId, teacherId, newClassId);

    setSelectedClass((prev) => ({
      ...prev,
      [teacherId]: "",
    }));
  };

  // 🔥 delete
  const handleDelete = async (teacherId) => {
    if (!user?.schoolId) return;

    if (!confirm("Delete teacher?")) return;

    await deleteTeacher(user.schoolId, teacherId);
  };

  // 🔥 normalize teachers (prevents missing keys crash)
  const safeTeachers = useMemo(() => {
    return (teachers || []).filter((t) => t?.uid);
  }, [teachers]);

  return (
    <div className="p-4 space-y-4">
      <p className="text-xl font-bold text-slate-400 text-center">Teachers</p>

      {!safeTeachers || safeTeachers.length < 1 ? (
        <Empty />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeTeachers.map((t) => (
            <div key={t.uid} className="bg-slate-900 rounded-xl p-4 space-y-3">
              {/* TOP INFO */}
              <div className="flex items-center gap-3">
                <UserIcon className="size-10 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t.name || "Teacher"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.email || "No email"}
                  </p>
                </div>
              </div>

              {/* CURRENT CLASS */}
              <p className="text-xs text-slate-400">
                Current:{" "}
                <span className="text-orange-500 font-medium">
                  {t.classId || "Not Set"}
                </span>
              </p>

              {/* CHANGE CLASS */}
              <div className="flex gap-2">
                <select
                  value={selectedClass[t.uid] || ""}
                  onChange={(e) => handleChange(t.uid, e.target.value)}
                  className="flex-1 bg-slate-800 text-white text-sm rounded px-2 py-1 outline-none"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => confirmChange(t.uid)}
                  className="px-3 bg-orange-500 hover:bg-orange-600 rounded text-white flex items-center justify-center"
                >
                  <CheckIcon className="size-4" />
                </button>
              </div>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(t.uid)}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 py-2 rounded-lg text-sm transition"
              >
                <TrashIcon className="size-4" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teachers;

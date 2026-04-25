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

  const [selectedClass, setSelectedClass] = useState({});

  const handleChange = (teacherId, value) => {
    setSelectedClass((prev) => ({
      ...prev,
      [teacherId]: value,
    }));
  };

  const confirmChange = async (teacherId) => {
    const newClassId = selectedClass[teacherId];
    if (!newClassId || !user?.schoolId) return;

    await updateTeacherClass(user.schoolId, teacherId, newClassId);

    setSelectedClass((prev) => ({
      ...prev,
      [teacherId]: "",
    }));
  };

  const handleDelete = async (teacherId) => {
    if (!user?.schoolId) return;
    if (!confirm("Delete teacher?")) return;

    await deleteTeacher(user.schoolId, teacherId);
  };

  const safeTeachers = useMemo(() => {
    return (teachers || []).filter((t) => t?.uid);
  }, [teachers]);

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4">

      {/* TITLE */}
      <p className="text-lg sm:text-xl font-bold text-slate-400 text-center">
        Teachers
      </p>

      {!safeTeachers.length ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

          {safeTeachers.map((t) => (
            <div
              key={t.uid}
              className="bg-slate-900 rounded-xl p-4 sm:p-5 space-y-4"
            >

              {/* TOP INFO */}
              <div className="flex items-center gap-3">
                <UserIcon className="size-10 text-slate-400 shrink-0" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {t.name || "Teacher"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
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

              {/* CLASS SELECT */}
              <div className="flex flex-col sm:flex-row gap-2">

                <select
                  value={selectedClass[t.uid] || ""}
                  onChange={(e) => handleChange(t.uid, e.target.value)}
                  className="w-full bg-slate-800 text-white text-sm rounded px-3 py-2 outline-none"
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
                  className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded text-white flex items-center justify-center"
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
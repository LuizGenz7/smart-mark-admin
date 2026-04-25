import React, { useEffect, useState } from "react";
import { UsersIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import useClassStore from "../stores/classes";
import { useAuth } from "../stores/auth";
import useTeacherStore from "../stores/teachers";

const Classes = () => {
  const classes = useClassStore((s) => s.classes);
  const addClass = useClassStore((s) => s.addClass);
  const deleteClass = useClassStore((s) => s.deleteClass);
  const teachers = useTeacherStore((s) => s.teachers);
  const [classTeachers, setClassTeachers] = useState({});

  useEffect(() => {
    const updated = {};

    classes.forEach(cls => {
      updated[cls.name] = teachers.filter(t => t.classId === cls.name );
    });

    setClassTeachers(updated);
  }, [classes, teachers]);

  const user = useAuth((s) => s.user);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // ➕ ADD CLASS
  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await addClass(user?.schoolId, name.trim());
      setName("");
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE CLASS
  const handleDelete = async (id) => {
    if (!confirm("Delete this class?")) return;
    await deleteClass(user?.schoolId, id);
  };

  return (
    <div className="p-4 space-y-6">
      {/* TITLE */}
      <p className="text-xl font-bold text-slate-400 text-center">
        Classes Overview
      </p>

      {/* ➕ ADD FORM */}
      <div className="flex gap-2 max-w-md mx-auto">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter class name (e.g. Grade 8)"
          className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-slate-100 outline-none border border-slate-700 focus:border-orange-500"
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition disabled:opacity-50"
        >
          <PlusIcon className="size-5" />
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* 📦 GRID */}
      <div className="grid grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="relative bg-slate-900 rounded-xl px-5 py-8 hover:bg-slate-800 transition"
          >
            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(cls.id)}
              className="absolute top-2 right-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 p-2 rounded-lg flex gap-2 cursor-pointer transition"
            >
              <TrashIcon className="size-4" />
              <p className="text-xs">Delete</p>
            </button>

            {/* CLASS NAME */}
            <p className="text-lg font-bold text-orange-500">{cls.name}</p>

            {/* TEACHERS */}
            <div className="flex items-center gap-2 mt-3 text-slate-300">
              <UsersIcon className="size-5 text-slate-400" />
              <p className="text-sm">
                {classTeachers[cls.name]?.length || 0} Teacher{cls.teachers > 1 ? "s" : ""}
              </p>
            </div>

            {/* BACKGROUND ICON */}
            <UsersIcon className="absolute bottom-2 right-2 size-16 text-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;

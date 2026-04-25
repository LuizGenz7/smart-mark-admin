import React, { useState } from "react";
import useTermStore from "../stores/terms";
import { formatDate, formatDateDDMMYYYY } from "../utils/date-helpers";
import { useAuth } from "../stores/auth";

const Terms = () => {
  const user = useAuth((s) => s.user);

  const activeTerm = useTermStore((s) => s.activeTerm);
  const otherTerms = useTermStore((s) => s.terms);

  const endActiveTerm = useTermStore((s) => s.endActiveTerm);
  const setActiveTerm = useTermStore((s) => s.setActiveTerm);

  const [form, setForm] = useState({
    name: "",
    begin: "",
    end: "",
  });

  function handleChange(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function addTerm() {
    if (!form.name || !form.begin || !form.end) return;

    const schoolId = user?.schoolId;
    if (!schoolId) return;

    const termObj = {
      id: `${form.name}_${form.begin}`,
      activeTerm: form.name,
      begin: formatDate(form.begin),
      end: formatDate(form.end),
    };

    setActiveTerm(schoolId, termObj);

    setForm({ name: "", begin: "", end: "" });
  }

  return (
    <div className="p-4 grid grid-cols-3 gap-6">

      {/* ================= LEFT ================= */}
      <div className="col-span-2 space-y-6">

        {/* ACTIVE TERM */}
        {activeTerm ? (
          <div className="relative overflow-hidden bg-linear-to-br from-orange-500 to-orange-700 rounded-2xl p-6 shadow-xl">

            <p className="text-xs uppercase tracking-wider text-white/70">
              Active Term
            </p>

            <p className="text-3xl font-bold text-white mt-1">
              {activeTerm.name || activeTerm.activeTerm}
            </p>

            <div className="flex gap-10 mt-6">
              <div>
                <p className="text-xs text-white/70">Start Date</p>
                <p className="text-sm font-semibold text-white">
                  {formatDateDDMMYYYY(activeTerm.begin)}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/70">End Date</p>
                <p className="text-sm font-semibold text-white">
                  {formatDateDDMMYYYY(activeTerm.end)}
                </p>
              </div>
            </div>

            <button
              onClick={() => endActiveTerm(user?.schoolId)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-black/30 hover:bg-black/40 text-white text-xs rounded-lg"
            >
              Deactivate
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 p-6 rounded-xl text-slate-400">
            No active term
          </div>
        )}

        {/* LIST */}
        <div className="space-y-3">
          <p className="text-slate-400 text-sm">Previous 5 Terms</p>

          {otherTerms.map((term, i) => (
            <div
              key={i}
              className="flex justify-between bg-slate-900 p-4 rounded-xl"
            >
              <div>
                <p className="text-white text-sm font-semibold">
                  {term.name || term.activeTerm}
                </p>

                <p className="text-xs text-slate-400">
                  {formatDateDDMMYYYY(term.begin)} —{" "}
                  {formatDateDDMMYYYY(term.end)}
                </p>
              </div>

              <div className="text-xs flex items-center justify-center bg-slate-800 px-3 py-1 rounded text-slate-400">
                Ended
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT FORM ================= */}
      <div className="bg-slate-900 p-5 rounded-xl space-y-4 h-fit">

        <p className="text-lg font-semibold text-orange-500">
          Add New Term
        </p>

        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Term name"
          className="w-full p-2 rounded bg-slate-800 text-white outline-none"
        />

        <input
          type="date"
          value={form.begin}
          onChange={(e) => handleChange("begin", e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white outline-none"
        />

        <input
          type="date"
          value={form.end}
          onChange={(e) => handleChange("end", e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white outline-none"
        />

        <button
          onClick={addTerm}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
        >
          Add & Set Active
        </button>
      </div>

    </div>
  );
};

export default Terms;
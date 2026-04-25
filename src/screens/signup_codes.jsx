import React, { useState } from "react";
import { KeyIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSignupCodeStore from "../stores/signup-codes";

const SignupCodes = () => {
  const codes = useSignupCodeStore((s) => s.codes);
  const sortedCodes = [...codes].sort((a, b) => {

    return Number(a.used) - Number(b.used);
  });
  function deleteCode(id) {
    setCodes((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-xl font-bold text-slate-400 text-center">
        Signup Codes
      </p>

      <div className="grid grid-cols-2 gap-4">
        {sortedCodes.map((c) => (
          <div key={c.id} className="bg-slate-900 rounded-xl p-4 space-y-3">
            {/* HEADER */}
            <div className="flex items-center gap-3">
              <KeyIcon className="size-8 text-orange-500" />
              <p className="text-lg font-bold text-white tracking-wider">
                {c.id}
              </p>
            </div>

            {/* STATUS */}
            <div className="flex items-center justify-between">
              {/* USED INFO */}
              <div className="flex flex-col">
                <p className="text-xs text-slate-400">
                  {c.used ? "Used By" : "Status"}
                </p>

                <p className="text-sm text-white">
                  {c.used ? c.usedBy : "Not used"}
                </p>
              </div>

              {/* BADGE */}
              <span
                className={`px-3 py-1 text-xs rounded-lg ${
                  c.used
                    ? "bg-green-500/20 text-green-400"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {c.used ? "Used" : "Available"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignupCodes;

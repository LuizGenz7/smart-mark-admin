import React from "react";
import { KeyIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSignupCodeStore from "../stores/signup-codes";

const SignupCodes = () => {
  const codes = useSignupCodeStore((s) => s.codes);
  const deleteCode = useSignupCodeStore((s) => s.deleteCode);

  const sortedCodes = [...(codes || [])].sort(
    (a, b) => Number(a.used) - Number(b.used)
  );

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4">

      {/* TITLE */}
      <p className="text-lg sm:text-xl font-bold text-slate-400 text-center">
        Signup Codes
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {sortedCodes.map((c) => (
          <div
            key={c.id}
            className="bg-slate-900 rounded-xl p-4 sm:p-5 space-y-4"
          >

            {/* HEADER */}
            <div className="flex items-center gap-3">
              <KeyIcon className="size-8 text-orange-500 shrink-0" />

              <p className="text-base sm:text-lg font-bold text-white tracking-wider truncate">
                {c.id}
              </p>
            </div>

            {/* STATUS ROW */}
            <div className="flex items-center justify-between gap-2">

              <div className="min-w-0">
                <p className="text-xs text-slate-400">
                  {c.used ? "Used By" : "Status"}
                </p>

                <p className="text-sm text-white truncate">
                  {c.used ? c.usedBy : "Not used"}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap ${
                  c.used
                    ? "bg-green-500/20 text-green-400"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {c.used ? "Used" : "Available"}
              </span>

            </div>

            {/* DELETE BUTTON */}
            

          </div>
        ))}

      </div>
    </div>
  );
};

export default SignupCodes;
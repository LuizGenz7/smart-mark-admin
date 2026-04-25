import React from "react";
import { useAuth } from "../stores/auth";

const Header = () => {
  const user = useAuth((s) => s.user);

  return (
    <div className="w-full hidden md:flex h-20 bg-slate-900 border-b border-slate-800 items-center justify-between px-6">
      {/* LEFT - USER INFO */}
      <div className="flex items-center gap-2">
        <img className="size-10 rounded-xl" src="/profile.webp" />
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-slate-100">
            {user?.name || "Unknown User"}
          </p>
          <p className="text-xs text-slate-400">{user?.email || "No email"}</p>
        </div>
      </div>

      {/* RIGHT - SCHOOL INFO */}
      <div className="flex flex-col items-end">
        <p className="text-sm font-semibold text-orange-500">
          {user?.schoolName || "No School"}
        </p>
        <p className="text-xs text-slate-400">ID: {user?.schoolId || "N/A"}</p>
      </div>
    </div>
  );
};

export default Header;

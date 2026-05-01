import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../stores/auth";
import Drawer from "../components/Drawer";
import Header from "../components/Header";
import { ArrowDownTrayIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const Layout = () => {
  const init = useAuth((state) => state.init);
  const watchAuth = useAuth((state) => state.watchAuth);

  useEffect(() => {
    init();
    const unsub = watchAuth();
    return unsub;
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Desktop */}
      <div className="hidden md:block">
        <Outlet />
      </div>

      {/* Mobile fallback */}
     <div className="flex md:hidden items-center justify-center min-h-screen bg-slate-950 px-6">
  <div className="w-full max-w-sm">

    {/* Card */}
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 shadow-2xl">

      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
        <ExclamationTriangleIcon className="w-7 h-7 text-yellow-400" />
      </div>

      {/* Title */}
      <h2 className="text-white text-lg font-semibold text-center tracking-tight">
        Mobile Not Supported
      </h2>

      {/* Description */}
      <p className="text-slate-400 text-sm text-center mt-2 leading-relaxed">
        This system is optimized for desktop use.
        Access it on mobile through the Smart Mark App.
      </p>

      {/* Role box */}
      <div className="mt-5 rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
        <p className="text-xs text-slate-400 text-center mb-3">
          Role-based access available for
        </p>

        <div className="flex flex-col gap-2 text-sm text-slate-300">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/70">
            <span>Teachers</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/70">
            <span>Administrators</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="mt-6 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all text-white text-sm font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/20">
        <ArrowDownTrayIcon className="w-4 h-4" />
        Download Smart Mark App
      </button>

    </div>

    {/* Footer note */}
    <p className="text-center text-[11px] text-slate-500 mt-4">
      Use a desktop browser for full system access
    </p>

  </div>
</div>
    </div>
  );
};

export default Layout;

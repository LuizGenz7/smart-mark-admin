import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UsersIcon,
  KeyIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../stores/auth";

const Drawer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuth((s) => s.logout);

  const menu = [
    { id: 1, text: "Dashboard", icon: HomeIcon, action: "/" },
    { id: 2, text: "Reports", icon: ChartBarIcon, action: "/reports" },
    { id: 3, text: "Terms", icon: BookOpenIcon, action: "/terms" },
    { id: 4, text: "Classes", icon: AcademicCapIcon, action: "/classes" },
    { id: 5, text: "Teachers", icon: UsersIcon, action: "/teachers" },
    { id: 6, text: "Signup Code", icon: KeyIcon, action: "/signup-code" },
    { id: 7, text: "Payments", icon: CreditCardIcon, action: "/payments" },
    { id: 8, text: "Support", icon: QuestionMarkCircleIcon, action: "/support" },
    { id: 9, text: "About", icon: InformationCircleIcon, action: "/about" },
  ];

  async function handleLogout() {
    await logout();
    navigate("/auth");
  }

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-3 border-b border-slate-800">
        <div>
          <p className="font-bold text-orange-500 text-xl">Smart Mark</p>
          <p className="text-slate-500 text-[9px]">Marking Made Easy</p>
        </div>
        <button className="size-8 flex justify-center items-center bg-slate-800 rounded-lg" onClick={() => setOpen(true)}>
          <Bars3Icon className="size-4 text-slate-500" />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* HEADER */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800">
          <div>
            <p className="text-orange-500 font-bold">Smart Mark</p>
            <p className="text-xs text-slate-500">School Admin</p>
          </div>

          {/* close button mobile */}
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <XMarkIcon className="size-6 text-white" />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.id}
              to={item.action}
              end={item.action === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-slate-800 text-orange-500"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon className="size-5" />
              <span className="text-sm">{item.text}</span>
            </NavLink>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="p-2 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition"
          >
            <ArrowRightOnRectangleIcon className="size-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Drawer;
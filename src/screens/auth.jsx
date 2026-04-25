import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../components/InputField";
import PrimaryButon from "../components/PrimaryButon";

import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../stores/auth";

const AuthScreen = () => {
  const navigate = useNavigate();

  const isLoading = useAuth((s) => s.loading);
  const error = useAuth((s) => s.error);
  const login = useAuth((s) => s.login);

  const [form, setForm] = useState({
    email: "",
    pass: "",
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.email || !form.pass) return;

    try {
      await login(form.email, form.pass);

      // redirect after success
      navigate("/");
    } catch (err) {
      // error already handled in store
      console.log(err.message);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border flex flex-col items-center justify-center border-slate-800 rounded-2xl shadow-xl p-6 space-y-5 text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl text-orange-500 font-semibold">
          Smart Mark
        </p>
        <p className="tracking-[4px] text-sm text-slate-500">
          Marking With Care
        </p>
      </div>

      <p className="text-xs text-orange-500">School Admin Panel</p>

      {/* FORM */}
      <form className="w-full space-y-3" onSubmit={submit}>
        
        <InputField
          type="email"
          label="Email"
          icon={UserIcon}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />

        <InputField
          type="password"
          isSecure
          label="Password"
          icon={LockClosedIcon}
          value={form.pass}
          onChange={(e) => update("pass", e.target.value)}
        />

        <PrimaryButon
          type="submit"
          extra="mt-4"
          disabled={isLoading}
        />

        {/* LOADING */}
        {isLoading && (
          <p className="text-center text-xs text-orange-500">
            Verifying. Please wait...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-center text-xs text-red-500">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthScreen;
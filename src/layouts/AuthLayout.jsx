import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../stores/auth";

const AuthLayout = () => {
  const init = useAuth((state) => state.init);
  const watchAuth = useAuth((state) => state.watchAuth);

  useEffect(() => {
    init();
    const unsub = watchAuth();
    return unsub;
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 flex items-center justify-center min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../stores/auth";
import Drawer from "../components/Drawer";
import Header from "../components/Header";

const Layout = () => {
  const init = useAuth((state) => state.init);
  const watchAuth = useAuth((state) => state.watchAuth);

  useEffect(() => {
    init();
    const unsub = watchAuth();
    return unsub;
  }, []);

  return (
    <Outlet />
  );
};

export default Layout;

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../stores/auth";

import useTeacherStore from "../stores/teachers";
import useClassStore from "../stores/classes";
import useCodesStore from "../stores/signup-codes";
import useTermStore from "../stores/terms";
import usePaymentStore from "../stores/payment";

import Drawer from "../components/Drawer";
import Header from "../components/Header";
import SplashScreen from "../components/Splash";

const AppLayout = () => {
  const [minSplashDone, setMinSplashDone] = useState(false);

  // 🔐 AUTH
  const init = useAuth((state) => state.init);
  const watchAuth = useAuth((state) => state.watchAuth);
  const user = useAuth((state) => state.user);

  // stores
  const useCachedTeachers = useTeacherStore((s) => s.useCachedTeachers);
  const listenToTeachers = useTeacherStore((s) => s.listenToTeachers);
  const stopTeacherListening = useTeacherStore((s) => s.stopListening);

  const useCachedClasses = useClassStore((s) => s.useCachedClasses);
  const listenToClasses = useClassStore((s) => s.listenToClasses);
  const stopClassListening = useClassStore((s) => s.stopListening);

  const useCachedCodes = useCodesStore((s) => s.useCachedCodes);
  const listenToCodes = useCodesStore((s) => s.listenToSignupCodes);
  const stopCodesListening = useCodesStore((s) => s.stopListening);

  const useCachedTerms = useTermStore((s) => s.useCachedTerms);
  const listenToTerms = useTermStore((s) => s.listenToTerms);
  const stopTermListening = useTermStore((s) => s.stopListening);

  const useCachedPayment = usePaymentStore((s) => s.useCachedPayment);
  const listenToPayment = usePaymentStore((s) => s.listenToPayment);
  const stopPaymentListening = usePaymentStore((s) => s.stopListening);

  // ================= SPLASH TIMER =================
  useEffect(() => {
    const t = setTimeout(() => {
      setMinSplashDone(true);
    }, 6000); // ⏱ 4 seconds minimum splash

    return () => clearTimeout(t);
  }, []);

  // ================= AUTH INIT =================
  useEffect(() => {
    init();
    const unsubAuth = watchAuth();

    return () => {
      if (typeof unsubAuth === "function") unsubAuth();

      stopTeacherListening();
      stopClassListening();
      stopCodesListening();
      stopTermListening();
      stopPaymentListening();
    };
  }, []);

  // ================= DATA LOAD =================
  useEffect(() => {
    if (!user?.schoolId) return;

    const schoolId = user.schoolId;

    useCachedTeachers();
    useCachedClasses();
    useCachedCodes();
    useCachedTerms();
    useCachedPayment();

    listenToTeachers(schoolId, true);
    listenToClasses(schoolId, true);
    listenToCodes(schoolId, true);
    listenToTerms(schoolId, true);
    listenToPayment(schoolId, true);

    return () => {
      stopTeacherListening();
      stopClassListening();
      stopCodesListening();
      stopTermListening();
      stopPaymentListening();
    };
  }, [user?.schoolId]);

  // ================= SPLASH CONDITION =================
  const isReady = user && minSplashDone;

  if (!isReady) {
    return (
      <SplashScreen />
    );
  }

  // ================= MAIN APP =================
  return (
    <div className="bg-slate-950 text-slate-100 flex min-h-screen">
      <Drawer />

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header />

        <div className="flex-1 no-scrollbar overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
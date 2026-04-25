import React from "react";
import Drawer from "../components/Drawer";
import Header from "../components/Header";
import OverviewCard from "../components/OverviewCard";
import {
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  KeyIcon,
  CreditCardIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import useTeacherStore from "../stores/teachers";
import useClassStore from "../stores/classes";
import useSignupCodeStore from "../stores/signup-codes";
import usePaymentStore from "../stores/payment";
import useTermStore from "../stores/terms";
import { createDashboardItems } from "../utils/dashboard"

const Dashboard = () => {
  const teachers = useTeacherStore((s) => s.teachers);
  const classes = useClassStore((s) => s.classes);
  const signupCodes = useSignupCodeStore((s) => s.codes);
  const payment = usePaymentStore((s) => s.payment);
  const term = useTermStore((s) => s.activeTerm);


  const dashboardItems = createDashboardItems({
    term,
    teachers,
    classes,
    signupCodes,
    payment,
  });

  return (
    <div className="h-full overflow-hidden flex flex-col justify-start items-center">
      <p className="text-xl font-bold text-slate-500">Over View</p>
      <div className="h-full p-4 w-full grid grid-cols-3 gap-4 overflow-y-auto pb-6">
        {dashboardItems.map((i) => (
          <OverviewCard
            key={i.id}
            icon={i.icon}
            text={i.text}
            sub={i.sub}
            action={i.route}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

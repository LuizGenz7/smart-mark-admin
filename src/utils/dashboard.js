import {
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  KeyIcon,
  CreditCardIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

/**
 * 🔥 Dynamic dashboard builder
 * Pass real data from Zustand / API
 */
export const createDashboardItems = ({
  term,
  teachers = [],
  classes = [],
  signupCodes = [],
  payment,
}) => {
  return [
    {
      id: "active-terms",
      text: "Active Term",
      sub: term?.activeTerm || "No active term",
      icon: CalendarIcon,
      route: "/terms",
    },

    {
      id: "teachers",
      text: "Teachers",
      sub: `${teachers.length}`,
      icon: UserGroupIcon,
      route: "/teachers",
    },

    {
      id: "classes",
      text: "Classes",
      sub: `${classes.length}`,
      icon: AcademicCapIcon,
      route: "/classes",
    },

    {
      id: "signup-codes",
      text: "Signup Codes",
      sub: `${signupCodes.length}`,
      icon: KeyIcon,
      route: "/signup-code",
    },

    {
      id: "payment",
      text: "Payment",
      sub: (!payment?.isDeactivated ? 'Active' : 'Not Active') || "Unknown",
      icon: CreditCardIcon,
      route: "/payments",
    },

    {
      id: "reports",
      text: "Reports",
      sub: "Generate",
      icon: ChartBarIcon,
      route: "/reports",
    },
  ];
};
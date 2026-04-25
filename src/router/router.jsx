import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from "../screens/Layout";
import AuthScreen from "../screens/auth";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../screens";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import Reports from "../screens/reports";
import Terms from "../screens/terms";
import Classes from "../screens/classes";
import Teachers from "../screens/teachers";
import SignupCodes from "../screens/signup_codes";
import Payment from "../screens/payment";
import Support from "../screens/support";
import About from "../screens/about";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />} path="/">

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="auth" element={<AuthScreen />} />
      </Route>

      {/* ================= APP ================= */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="terms" element={<Terms />} />
        <Route path="classes" element={<Classes />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="signup-code" element={<SignupCodes />} />
        <Route path="payments" element={<Payment />} />
        <Route path="support" element={<Support />} />
        <Route path="about" element={<About />} />
      </Route>

    </Route>
  )
);
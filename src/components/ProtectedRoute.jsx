import { Navigate } from "react-router-dom";
import { useAuth } from "../stores/auth";

const ProtectedRoute = ({ children }) => {
  const user = useAuth((state) => state.user);
  const initialized = useAuth((state) => state.initialized);

  if (!initialized) return null; // or loading screen

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { meApi } from "../api/auth.api";

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!hasHydrated) {
        return;
      }

      try {
        const response = await meApi();
        setAuth(response.data);
      } catch (error) {
        logout();
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifySession();
  }, [hasHydrated, setAuth, logout]);

  if (!hasHydrated || isCheckingSession) {
    return (
      <div className="flex justify-center items-center text-3xl h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
};

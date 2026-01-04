import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const location = useLocation();

  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center text-3xl h-screen">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return children;
};

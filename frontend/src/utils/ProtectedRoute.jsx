import useAuthStore from "../stores/authStore";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ( {children} ) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const location = useLocation();

       if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center text-3xl h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        replace 
        state={{ from: location }}
      />
    );
  }
    
    return children;
}
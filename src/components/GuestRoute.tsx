import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem("token");

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default GuestRoute;

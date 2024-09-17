import { useSelector } from "react-redux";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import { Navigate } from "react-router-dom";
import { FC } from "react";

// Define TypeScript types
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ProtectedRoute component to handle authentication and role checks
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useSelector(selectUserDetails);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

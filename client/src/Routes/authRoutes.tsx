import { Route } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../Components/ReusableComp/ProtectedRoute";

const Login = lazy(() => import("../Pages/LoginSignup/Login"));
const VendorLogin = lazy(() => import("../Pages/VendorAuth/VendorLogin"));
const VendorSignup = lazy(() => import("../Pages/VendorAuth/VendorSignup"));
const Signup = lazy(() => import("../Pages/LoginSignup/Signup"));
const ProfilePage = lazy(() => import("../Pages/Profile/ProfilePage"));

const authRoutes = [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="signup" path="/sign-up" element={<Signup />} />,
  <Route
    key="vendorSignup"
    path="/vendor/register"
    element={<VendorSignup />}
  />,
  <Route key="vendorLogin" path="/vendor/login" element={<VendorLogin />} />,
  <Route
    key="profile"
    path="/user/profile"
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />,
];

export default authRoutes;

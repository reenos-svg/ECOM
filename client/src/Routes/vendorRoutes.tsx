import { Route } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../Components/ReusableComp/ProtectedRoute";

const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));

const vendorRoutes = [
  <Route
    key="dashboard"
    path="/vendor/dashboard/:id"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
];

export default vendorRoutes;

import { Route } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../Components/ReusableComp/ProtectedRoute";

const Cart = lazy(() => import("../Pages/Cart/Cart"));
const Wishlist = lazy(() => import("../Pages/Wishlist/Wishlist"));

const cartRoutes = [
  <Route
    key="cart"
    path="/cart"
    element={
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    }
  />,
  <Route key="wishlist" path="/wishlist" element={<Wishlist />} />,
];

export default cartRoutes;

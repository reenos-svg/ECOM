import { Route } from "react-router-dom";
import { lazy } from "react";
import CreateOrder from "../Pages/CreateOrder/CreateOrder";
import OrderSuccess from "../Pages/OrderSuccess/OrderSuccess";
import UserOrderDetailsPage from "../Pages/UserOrderDetailsPage/UserOrderDetailsPage";

const Shop = lazy(() => import("../Pages/Shop/Shop"));
const ShopCategory = lazy(() => import("../Pages/ShopCategory/ShopCategory"));
const ShopByProducts = lazy(
  () => import("../Pages/ShopByProducts/ShopByProducts")
);
const ShopByThemes = lazy(() => import("../Pages/ShopByThemes/ShopByThemes"));
const Product = lazy(() => import("../Pages/Product/Product"));
const ProductDetails = lazy(
  () => import("../Pages/ProductDetails/ProductDetails")
);

const shopRoutes = [
  <Route key="default" path="/" element={<Shop />} />,
  <Route key="men" path="/men" element={<ShopCategory category="men" />} />,
  <Route
    key="women"
    path="/women"
    element={<ShopCategory category="women" />}
  />,
  <Route key="themes" path="/themes" element={<ShopByThemes />} />,
  <Route key="shop" path="/shop-products" element={<ShopByProducts />} />,
  <Route key="product" path="product">
    <Route path=":productName/:productId" element={<Product />} />
  </Route>,
  <Route
    key="productDetails"
    path="/product-details/:id"
    element={<ProductDetails />}
  />,
  <Route
    key="userOrderDetails"
    path="/user/:id/order"
    element={<UserOrderDetailsPage />}
  />,
  <Route
    key={"createOrder"}
    path="/:id/create-order"
    element={<CreateOrder />}
  />,
  <Route
    key={"ordersuccess"}
    path="/order-success"
    element={<OrderSuccess />}
  />,
];

export default shopRoutes;

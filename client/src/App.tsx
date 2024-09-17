import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Loader from "./Components/ReusableComp/Loader";
import authRoutes from "./Routes/authRoutes";
import shopRoutes from "./Routes/shopRoutes";
import vendorRoutes from "./Routes/vendorRoutes";
import cartRoutes from "./Routes/cartRoutes";
import { useSelector } from "react-redux";
import { selectUserDetails } from "./Redux/selector/SelectAuthData";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const { role } = useSelector(selectUserDetails);


  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {authRoutes}
            {shopRoutes}
            {(role === "vendor" || role === "admin") && vendorRoutes}
            {cartRoutes}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;

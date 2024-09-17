import React, { memo } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import img from "../../assets/orderPlaced.gif";

const OrderSuccess = memo(() => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col min-h-screen gap-4 items-center justify-center">
        <img src={img} alt="" />
        <h1 className=" font-ubuntu text-4xl font-semibold">
          Order Placed Successfully
        </h1>
      </div>
      <Footer />
    </div>
  );
});

export default OrderSuccess;

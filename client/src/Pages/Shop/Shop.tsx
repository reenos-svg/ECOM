// src/pages/Shop.tsx
import { memo } from "react";
import LandingPage from "../../Components/LandingPage/LandingPage";
import HorizonatalScroll from "../../Components/ReusableComp/HorizonatalScroll";
import NewsCard from "../../Components/NewsCard/NewsCard";
import Featured from "../../Components/FeaturedProducts/Featured";
import NewCollection from "../../Components/NewCollection/NewCollection";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const Shop = memo(() => {
  return (
    <div className="overflow-hidden bg-orange-100">
      <Navbar />

      <LandingPage />
      <HorizonatalScroll />
      <Featured />
      <NewCollection />
      <NewsCard />
      <Footer />
    </div>
  );
});

export default Shop;

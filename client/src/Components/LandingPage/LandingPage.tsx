import { memo } from "react";
import { useFetchCarouselImagesQuery } from "../../Redux/rtk/homepageApi";
import aarem from "../Assets/Assets/aarem-men.png";
import Button from "../ReusableComp/Button";
import { RightArrowIcon } from "../Icons/Icons";
import bag from "../../assets/aarem-bag-logo.png";
import { useNavigate } from "react-router-dom";
import SpinLoader from "../../Components/ReusableComp/SpinLoader"; // Import your loader
import Carousel from "../../Components/ReusableComp/Carousel";

const LandingPage = memo(() => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/shop-products");
  };

  const { data: carouselImages, isLoading } = useFetchCarouselImagesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinLoader />
      </div>
    );
  }

  // Extract URLs from carousel image data
  const imageUrls = carouselImages?.map((item) => item.url) || [];

  return (
    <>
      <div className="w-full h-full flex flex-col md:flex-row ">
        <div className="flex flex-col md:flex-row justify-between p-6 md:p-10">
          <div className="flex flex-col items-center justify-center gap-8 p-10 relative">
            <h1 className=" p-4 rounded-3xl bg-orange-300 text-orange-700 font-ubuntu h-10 flex items-center text-xl md:text-3xl w-[20rem] md:w-[30rem]">
              BEST COLLECTION THIS YEAR
            </h1>
            <div className="flex justify-center flex-row gap-2 items-center flex-wrap w-9/12">
              <span className="md:text-5xl text-3xl font-ubuntu font-medium z-10">
                Unleash Your Unique
              </span>
              <img
                src={bag}
                alt=""
                className="absolute md:h-52 h-28 md:left-20 left-40  z-0"
              />
              <span className="z-10 md:text-5xl text-3xl font-ubuntu font-medium text-orange-500">
                Fashion Identity
              </span>
            </div>
            <p className="md:w-3/5 text-center text-gray-700 font-ubuntu text-lg font-medium">
              Explore our curated collection of timeless classics and the latest
              trends to elevate your style. Indulge in premium quality and
              sophisticated designs at unbeatable prices.
            </p>
            <Button
              btnContent="Shop Now"
              btnOnClick={handleShopNowClick}
              btnType="shop"
              btnIcon={<RightArrowIcon />}
            />
          </div>
          <img src={aarem} alt="men" className="md:h-[35rem] rounded-3xl" />
        </div>
      </div>
      <Carousel images={imageUrls} /> {/* Add Carousel here */}
     
    </>
  );
});

export default LandingPage;

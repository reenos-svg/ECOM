import { memo } from "react";
import RenderHeader from "../ReusableComp/RenderHeading";
import Button from "../ReusableComp/Button";
import men from "../Assets/Assets/menfashion.jpg";
import women from "../Assets/Assets/womenfashion.jpg";
import kids from "../Assets/Assets/kidsfashion.jpg";
import { RedirectIcon } from "../Icons/Icons";
import { useNavigate } from "react-router-dom";

const NewCollection = memo(() => {

  const navigate = useNavigate();

  const handleShowCollections = () => {
    navigate("/shop-products");
  };

  const headerData = {
    heading: "Our Collection",
    description:
      "By having many categories of clothes, we ensure that every customer can find the right choice for their styles and needs, so that they could look confident and appropriate for different occasions or moods.",
    btnComponent: (
      <Button
        btnContent="View All Collections"
        btnType="shopNewArrivals"
        btnOnClick={handleShowCollections}
      />
    ),
  };

  const handleMenFashion = () => {
    navigate('/men');
  };

  const handleWomenFashion = () => {
    navigate('/women');
  };

  const handleKidFashion = () => {
    navigate('/kid');
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-8">
      <RenderHeader
        heading={headerData.heading}
        description={headerData.description}
        buttonComponent={headerData.btnComponent}
      />

      <div className="flex flex-row flex-wrap gap-6 items-center justify-center">
        <div className="relative ">
          <img src={men} alt="" className="md:h-96 rounded-3xl" />
          <div className="flex w-full flex-row justify-between items-center absolute bottom-0  right-0">
            <span className="font-ubuntu text-2xl md:text-4xl text-orange-600 font-semibold mx-auto">Women's Collection</span>
            <Button
              btnIcon={<RedirectIcon />}
              btnOnClick={handleWomenFashion}
              btnType="collectionBtn"
            />
          </div>
        </div>

        <div className="relative ">
          <img src={women} alt="" className="md:h-96 rounded-3xl" />
          <div className="flex w-full flex-row justify-between items-center absolute bottom-0 right-0">
            <span className="font-ubuntu text-2xl md:text-4xl text-orange-600 font-semibold mx-auto">Men's Collection</span>
            <Button
              btnIcon={<RedirectIcon />}
              btnOnClick={handleMenFashion}
              btnType="collectionBtn"
            />
          </div>
        </div>

        <div className="relative ">
          <img src={kids} alt="" className="md:h-96 rounded-3xl" />
          <div className="flex w-full flex-row justify-between items-center absolute bottom-0 right-0">
            <span className="font-ubuntu text-2xl md:text-4xl text-orange-600 font-semibold mx-auto">Kid's Collection</span>
            <Button
              btnIcon={<RedirectIcon />}
              btnOnClick={handleKidFashion}
              btnType="collectionBtn"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default NewCollection;

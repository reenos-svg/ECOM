import { FC, memo } from "react";
import RenderHeader from "../../ReusableComp/RenderHeading";
import Button from "../../ReusableComp/Button";
import img from "../../Assets/Assets/product_19.png";
import { ProductProps } from "../../../Redux/rtk/productApi";

interface CardProps {
  title?: string;
  amount?: number;
  type?: string;
  cardType?: string;
  data?: ProductProps[];
}

const Card: FC<CardProps> = memo(({ title, amount, type, cardType, data }) => {
  
  const handleGetProducts = () => {
    console.log("Clicked on All Products");
  };

  return (
    <div>
      {cardType === "recentProducts" ? (
        <div className="bg-gray-100 px-2 w-[22rem] md:min-w-[560px] border-2 rounded-xl min-h-96">
          <RenderHeader
            subHeading="Recent Products"
            buttonComponent={
              <Button btnContent="All Products" btnOnClick={handleGetProducts} />
            }
          />
          {data?.length ? (
            data.map((item: ProductProps, index: number) => (
              <div
                className="flex flex-row justify-between items-center border-t-2 border-gray-200 px-2 py-3"
                key={index}
              >
                <img
                  src={item.productImages[0] || img}
                  alt=""
                  className="h-20 rounded-xl border-2"
                />
                <div className="flex flex-col gap-4 ">
                  <h1 className="font-ubuntu font-semibold">
                    {item.productName}
                  </h1>
                  <h2 className="font-ubuntu text-desc font-medium">
                    {item.productStock} stocks remaining
                  </h2>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <span className="text-green-500 text-xl mr-2">●</span>
                  <span className="text-lg text-green-500">Available</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products available</p>
          )}
        </div>
      ) : (
        <div
          className={`h-32 flex flex-row gap-4 w-[22rem] md:w-96 border-2 p-4 rounded-3xl ${
            type === "orderValue"
              ? "bg-orange-400"
              : type === "noOfReturns"
              ? "bg-[#ACD793]"
              : type === "cancelledOrders"
              ? "bg-[#C40C0C]"
              : type === "noOfOrders"
              ? "bg-[#FF9F66]"
              : type === "yourBalance"
              ? "bg-[#ACD793]"
              : null
          }`}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-[#FEFFD2] font-ubuntu font-semibold text-2xl">
              {title}
            </h1>
            <h2 className="text-[#FEFFD2] font-ubuntu font-semibold text-2xl">
              {type === "orderValue" || type === "yourBalance" ? "₹" : null}{" "}
              {amount}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
});

export default Card;

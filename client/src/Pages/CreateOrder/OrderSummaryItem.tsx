import React from "react";

interface OrderSummaryItemProps {
  productName: string;
  productImage: string;
  productPrice: number;
  productSize: string;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  productName,
  productImage,
  productPrice,
  productSize,
}) => {
 

  return (
    <>
      <div className=" flex flex-col ">
        <div className="flex items-center p-4 border-b">
          <img
            src={productImage}
            alt={productName}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{productName}</h3>
            <p className="text-sm text-gray-500">{productSize}</p>
            <p className="text-sm font-semibold">Rs.{productPrice}</p>
          </div>
        </div>

      
      </div>
    </>
  );
};

export default OrderSummaryItem;

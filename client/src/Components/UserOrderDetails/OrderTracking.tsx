import React, { memo } from "react";
import RenderHeader from "../ReusableComp/RenderHeading";
import orderedImg from "../../assets/ordered.png";
import processedImg from "../../assets/processsig.png";
import onwayImg from "../../assets/onway.png";
import deliveredImg from "../../assets/delivered.png";
import orderConfirm from "../../assets/order-confirm.png";

type OrderStatus =
  | "Order Placed"
  | "Order Confirm"
  | "Processing"
  | "On the way"
  | "Delivered"
  | "Canceled";

interface OrderTrackingProps {
  status: OrderStatus;
}

const statusData: Record<
  OrderStatus,
  { color: string; image: string; label: string }
> = {
  "Order Placed": {
    color: "bg-gray-300 rounded-xl text-gray-300",
    image: orderedImg,
    label: "Order Placed",
  },
  "Order Confirm": {
    color: "bg-gray-300 rounded-xl text-gray-300",
    image: orderConfirm,
    label: "Order Confirm",
  },
  Processing: {
    color: "bg-gray-300 rounded-xl text-gray-300",
    image: processedImg,
    label: "Processing",
  },
  "On the way": {
    color: "bg-gray-300 rounded-xl text-gray-300",
    image: onwayImg,
    label: "On the way",
  },
  Delivered: {
    color: "bg-green-500 rounded-xl text-green-500",
    image: deliveredImg,
    label: "Delivered",
  },
  Canceled: {
    color: "bg-red-500 rounded-xl text-red-500",
    image: deliveredImg, // Assuming you want to use the delivered image for canceled as well
    label: "Canceled",
  },
};

const stepOrder: OrderStatus[] = [
  "Order Placed",
  "Order Confirm",
  "Processing",
  "On the way",
  "Delivered",
];

const OrderTracking: React.FC<OrderTrackingProps> = memo(({ status }) => {
  const getStepColor = (step: OrderStatus) => {
    if (step === status)
      return "bg-green-500 text-green-500 rounded-xl font-ubuntu font-semibold";
    if (stepOrder.indexOf(step) < stepOrder.indexOf(status))
      return "bg-green-500 text-green-500";
    return statusData[step].color;
  };

  return (
    <div className="p-2">
      <RenderHeader subHeading="Status" />
      <div className="flex flex-col items-center mt-4">
        {stepOrder.map((step, index) => {
          // Display "On the way" if the current status is "Processing" or "On the way"
          if (
            step === "On the way" &&
            (status === "Processing" || status === "On the way")
          ) {
            return (
              <React.Fragment key={step}>
                <div className="flex flex-row items-center space-y-2 mb-4">
                  <img
                    src={statusData["On the way"].image}
                    alt={statusData["On the way"].label}
                    className="w-20 h-16"
                  />
                  <span className="font-ubuntu font-medium">
                    {statusData["On the way"].label}
                  </span>
                </div>
                {index < stepOrder.length - 1 && (
                  <div className={` h-32  w-1 ${getStepColor(step)}`}></div>
                )}
              </React.Fragment>
            );
          }

          // Render other steps
          return (
            <React.Fragment key={step}>
              <div className="flex flex-row items-center space-y-2">
                <img
                  src={statusData[step].image}
                  alt={statusData[step].label}
                  className="w-20 h-16"
                />
                <span className="font-ubuntu font-medium">
                  {statusData[step].label}
                </span>
              </div>
              {index < stepOrder.length - 1 && (
                <div className={`h-32 w-1 ${getStepColor(step)}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});

export default OrderTracking;

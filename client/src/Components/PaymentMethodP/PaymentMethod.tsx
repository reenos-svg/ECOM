import { memo } from "react";
import img from "../../assets/Razorpaylogo.webp";
import img2 from "../../assets/3d-casual-life-delivery-boy-on-scooter.png";

const PaymentMethod = memo(() => {
  const imgData = [
    {
      img,
    },
    {
      img2,
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl md:text-3xl font-ubuntu font-medium">
          Available Payment Options
        </h1>
        <div className="flex md:flex-row flex-col gap-6 items-center">
          {imgData.map((item, index) => (
            <div
              key={index}
              className="border-2 hover:scale-95 cursor-pointer rounded-xl w-[80%] md:w-[40%]"
            >
              <img src={item.img} alt="" className="md:h-40 h-20 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export default PaymentMethod;

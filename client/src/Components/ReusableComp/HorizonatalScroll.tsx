import { memo } from "react";

const HorizonatalScroll = memo(() => {
  return (
    <div>
      {" "}
      <div className="relative bg-black text-white w-full h-20 py-6 overflow-hidden">
        <div className="absolute top-3 left-0 bottom-auto w-full transform translate-x-full whitespace-nowrap animate-move">
          <div className="flex flex-row gap-4 items-center">
            <span className="text-3xl font-semibold font-ubuntu border-white border-2 rounded-full  p-2 w-80 text-center">New Collections</span>
            <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
            <span className="text-3xl font-semibold font-ubuntu border-white border-2 rounded-full  p-2 w-80 text-center">Official Merchandise</span>
            <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
            <span className="text-3xl font-semibold font-ubuntu border-white border-2 rounded-full  p-2 w-80 text-center">Orignal Products</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HorizonatalScroll;

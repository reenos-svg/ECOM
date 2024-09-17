import { FC, ReactNode, memo } from "react";

interface ButtonProps {
  btnContent?: string;
  btnIcon?: ReactNode;
  btnOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  btnType?: string;
  selected?: boolean; // New prop to indicate if the button is selected
  style?: React.CSSProperties; // For dynamic button styles
  buttontype?: "submit" | "reset" | "button" | undefined;
}

const Button: FC<ButtonProps> = memo(
  ({
    btnOnClick,
    btnContent,
    buttontype,
    btnType,
    btnIcon,
    selected,
    style,
  }) => {
    return (
      <div>
        <button
          className={`flex justify-center gap-3 text-center py-2 ${
            btnType === "normal"
              ? "md:  w-16 px-2 rounded-xl py-1"
              : btnType === "noColor"
              ? "w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-gray-500 text-center flex items-center"
              : btnType === "subscribe"
              ? " rounded-2xl bg-black px-10 py-4 text-white hover:bg-gray-500 text-center flex items-center"
              : btnType === "size"
              ? `md:px-4 px-3 bg-orange-200 rounded-xl py-1 ${
                  selected ? "bg-orange-400" : ""
                }`
              : btnType === "color"
              ? `px-4 bg-orange-200 rounded-xl py-1 ${
                  selected ? "bg-orange-400" : ""
                }`
              : btnType === "shop"
              ? "px-6 md:w-40 w-26 bg-orange-600 hover:bg-orange-400 rounded-xl text-white"
              : btnType === "shopNewArrivals"
              ? "px-2 md:ml-4 mt-4 md:w-52 bg-orange-400 hover:bg-orange-600 rounded-xl text-white"
              : btnType === "collectionBtn"
              ? "bg-orange-600 h-14 w-14 md:h-20 md:w-20 flex items-center p-6 rounded-br-xl rounded-tl-xl"
              : btnType === "checkout"
              ? "bg-white w-60 flex items-center p-6 rounded-3xl"
              : "text-white bg-black hover:bg-slate-700 px-6 rounded-xl"
          } font-ubuntu`}
          onClick={btnOnClick}
          style={style}
          type={buttontype}
        >
          {btnContent}
          {btnIcon}
        </button>
      </div>
    );
  }
);

export default Button;

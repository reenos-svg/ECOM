import { FC, memo } from "react";

interface SwitchButtonProps {
  isChecked: boolean;
  onChange: () => void;
}

const SwitchButton: FC<SwitchButtonProps> = memo(
  ({  isChecked, onChange }) => {
    
    return (
      <div>
        <button
          type="button"
          onClick={onChange}
          className={`relative inline-block h-8 w-16 rounded-full border-2 border-orange-400 bg-orange-400 focus:outline-none transition-transform ease-in-out duration-300`}
        >
          <span
            className={`absolute top-[2px] w-6 h-6 rounded-full bg-white shadow-md transform ${
              isChecked ? "translate-x-1" : "-translate-x-7"
            }`}
          ></span>
        </button>
      </div>
    );
  }
);

export default SwitchButton;

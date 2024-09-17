import { FC, memo, useState, useEffect, useRef, useCallback } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

// Define the type for the data object expected in the dropdown
interface DataType {
  label: string;
  value: string;
}

// Define the props expected by the Dropdown component
interface SelectDropDown {
  data: DataType[]; // Data object for dropdown options
  additionaldispatchHandler?: ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => void; // Handler for dispatching selected value
  dispatchHandler?: (label: string, value: string) => void; // Additional handler if needed
  selectField?: string | null; // Currently selected field (optional)
  placeHolder: string;
  type: "style" | "normal" | "style-Over";
}

// Define Dropdown component
const SelectDropDown: FC<SelectDropDown> = memo(
  ({
    data = [],
    dispatchHandler,
    additionaldispatchHandler,
    selectField,
    placeHolder,
    type,
  }) => {
    // State to manage dropdown open/close
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Reference to the dropdown DOM element
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Function to toggle dropdown open/close
    const toggleDropDown = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    // Function to handle setting the selected field
    const handleSetField = useCallback(
      (label: string, value: string) => {
        if (dispatchHandler) {
          dispatchHandler(label, value); // Call dispatchHandler with the selected field
        }
        if (additionaldispatchHandler) {
          additionaldispatchHandler({ name: "WhatsApp", value: label }); // Dispatch selected value
        }
        toggleDropDown(); // Close dropdown after selection
      },
      [additionaldispatchHandler, dispatchHandler, toggleDropDown]
    );

    // Function to handle click outside of dropdown to close it
    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    }, []);

    // Effect to add and remove click event listener for outside clicks
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);

    return (
      <div ref={dropdownRef} className="relative w-full">
        {/* Dropdown button */}
        <button
          type="button"
          className={`border rounded-xl ${
            selectField === null
              ? "border-red-400 border-2"
              : type === "style" && "border-gray-400"
          } w-full h-[2.5rem] ${
            type === "normal" || type === "style-Over"
              ? "rounded-xl border border-gray-400"
              : ""
          } bg-white flex justify-between pr-3 items-center pl-2`}
          onClick={toggleDropDown}
        >
          {/* Selected field text */}
          <p
            className={`text-sm font-ubuntu pl-2 ${
              selectField ? "text-black" : "text-gray-400"
            }`}
          >
            {selectField || placeHolder}
          </p>
          {/* Dropdown arrow icon */}
          <MdKeyboardArrowDown
            className={`text-xl cursor-pointer transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className={`absolute top-full w-full mt-2 bg-white rounded-md shadow-gray-300 shadow-md ${
              type === "style-Over" ? "h-auto" : "h-[10rem]"
            } z-10 overflow-y-auto`}
          >
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <p
                  key={index}
                  className={`p-2 cursor-pointer font-ubuntu font-medium text-sm ${
                    selectField === item.value ? "bg-LightSlateGray" : ""
                  } ${
                    type === "style-Over"
                      ? "hover:bg-Bone"
                      : "hover:bg-LightSlateGray"
                  }`}
                  onClick={() => handleSetField(item.label, item.value)}
                >
                  {item.label}
                </p>
              ))
            ) : (
              <p className="p-2 font-ubuntu text-sm text-center">No data</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default SelectDropDown;

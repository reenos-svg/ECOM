import { FC, memo, useState, useEffect, useRef, useCallback } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

// Define the type for the data object expected in the dropdown
interface DataType {
  [key: string]: string;
}

// Define the props expected by the Dropdown component
interface DropdownProps {
  data?: DataType; // Data object for dropdown options
  additionaldispatchHandler?: ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => void; // Handler for dispatching selected value
  dispatchHandler?: (field: string) => void; // Additional handler if needed
  selectFeild?: string | null; // Currently selected field (optional)
  placeHolder: string;
  SecondarySelectFeild?: string | null;
  type: "style" | "normal" | "style-Over";
}

// Define Dropdown component
const DropDownSelect: FC<DropdownProps> = memo(
  ({
    data,
    dispatchHandler,
    additionaldispatchHandler,
    selectFeild,
    placeHolder,
    type,
    SecondarySelectFeild,
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
      (field: string) => {
        if (dispatchHandler) {
          dispatchHandler(field); // Call additionaldispatchHandler with the selected field
        }
        if (additionaldispatchHandler) {
          additionaldispatchHandler({ name: "WhatsApp", value: field }); // Dispatch selected value
        }
        toggleDropDown(); // Close dropdown after selection
      },
      [additionaldispatchHandler, dispatchHandler, toggleDropDown] // dependencies
    );

    // fuction for to handle mouse click out side  of dropdown
    const handleClickOutside = useCallback((event: MouseEvent) => {
      // Check if the dropdown reference exists and if the clicked target is not within the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // If clicked outside the dropdown, close the dropdown by setting isOpen to false
        setIsOpen(false);
      }
    }, []); // Dependencies array is empty as this callback doesn't rely on any external variables

    // Effect to handle click outside dropdown to close it
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside); // Add event listener on mount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside); // Remove event listener on unmount
      };
    }, [handleClickOutside]);

    return (
      <div ref={dropdownRef} className="relative w-full">
        {/* Dropdown button */}
        <button
          type="button"
          className={`border rounded-xl ${
            selectFeild === null
              ? "border-red-400 border-2"
              : type === "style" && "border-gray-400"
          }  w-full h-[2.5rem] ${
            type === "normal" || type === "style-Over"
              ? "rounded-xl border border-gray-400"
              : " "
          }  bg-white flex justify-between pr-3 items-center pl-2`}
          onClick={toggleDropDown}
        >
          {/* Selected field text */}
          <p
            className={`text-sm font-ubuntu pl-2 ${
              selectFeild || SecondarySelectFeild
                ? "text-black"
                : "text-gray-400"
            } `}
          >
            {selectFeild || SecondarySelectFeild || placeHolder}
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
            }  z-10 overflow-y-auto`}
          >
            {data && Object.keys(data).length > 0 ? (
              Object.keys(data).map((key, index) => (
                <p
                  key={index}
                  className={`p-2 cursor-pointer font-ubuntu font-medium text-sm ${
                    selectFeild === data[key] ? "bg-LightSlateGray" : ""
                  } ${
                    type === "style-Over"
                      ? "hover:bg-Bone"
                      : "hover:bg-LightSlateGray"
                  } `}
                  onClick={() => handleSetField(data[key])}
                >
                  {data[key]}
                </p>
              ))
            ) : (
              <p className="p-2 font-ubuntu  text-sm text-center">No data</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default DropDownSelect;

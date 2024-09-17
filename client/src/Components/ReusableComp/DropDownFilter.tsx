// src/Components/DropDownFilter/DropDownFilter.tsx

import React, { useState } from 'react';

interface DropDownFilterProps {
  items: string[]; // Array of items to display in the DropDownFilter
  selectedItem: string | null; // Currently selected item
  onSelect: (item: string) => void; // Callback for item selection
  placeholder?: string; // Placeholder text for the DropDownFilter
}

const DropDownFilter: React.FC<DropDownFilterProps> = ({
  items,
  selectedItem,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: string) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative md:inline-block text-left md:w-full w-48  md:max-w-xs">
      <button
        type="button"
        className="block w-full py-2 px-3 border border-orange-300 bg-white rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-transform duration-200 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-md font-ubuntu">{selectedItem || placeholder}</span>
        <svg
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500 transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-orange-300 rounded-md shadow-lg transition-opacity duration-200 ease-in-out opacity-100">
          <ul className="py-1">
            <li
              className={`px-4 py-2 text-md font-ubuntu cursor-pointer hover:bg-orange-100 ${
                selectedItem === null ? 'bg-orange-100' : ''
              }`}
              onClick={() => handleItemClick('')}
            >
              All
            </li>
            {items.map((item) => (
              <li
                key={item}
                className={`px-4 py-2 text-md font-ubuntu cursor-pointer hover:bg-orange-100 ${
                  item === selectedItem ? 'bg-orange-100' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDownFilter;

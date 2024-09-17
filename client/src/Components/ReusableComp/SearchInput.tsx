import { FC, memo } from "react";
import { SearchIcon } from "../Icons/Icons";

// Define props interface for SearchInput component
interface SearchInputProps {
  placeHolder: string; // Placeholder text for the input field
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange event handler
}

// SearchInput component renders a search input field with a search icon
const SearchInput: FC<SearchInputProps> = memo(({ placeHolder, onChange }) => {
  return (
    <div className="w-full border border-gray-400 h-[2.5rem] rounded-xl bg-white flex gap-2 px-2 items-center overflow-hidden">
      <SearchIcon /> {/* Search icon component */}
      <input
        type="text"
        className="w-full h-full focus:outline-none"
        placeholder={placeHolder} // Placeholder text
        onChange={onChange} // Pass onChange event handler if provided
      />
    </div>
  );
});

export default SearchInput; // Exporting SearchInput component

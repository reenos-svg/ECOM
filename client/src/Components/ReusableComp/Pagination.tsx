import { FC, memo } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Define the props interface for Pagination component
interface PaginationProps {
  currentPage: number; // Current page number
  totalPages: number; // Total number of pages
  rowsPerPage: number; // Number of rows per page
  availableOptions: number[]; // Array of available options for rows per page
  onPreviousPage: () => void; // Function to handle previous page button click
  onNextPage: () => void; // Function to handle next page button click
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Function to handle rows per page change
}

// Define Pagination component
const Pagination: FC<PaginationProps> = memo(
  ({
    currentPage,
    totalPages,
    rowsPerPage,
    availableOptions,
    onPreviousPage,
    onNextPage,
    onRowsPerPageChange,
  }) => {
    return (
      <div className="flex flex-col md:flex-row justify-end items-center mt-4">
        {/* Rows per page selector */}
        <div className="flex justify-end items-center mt-2 mr-4">
          <span className="py-2 font-ubuntu font-medium mr-2">
            Rows per page:
          </span>
          <select
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            className="px-2 py-1 border rounded-md outline-none cursor-pointer"
          >
            {availableOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Display current page and total pages */}
        <span className="py-2 font-ubuntu font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex flex-row ">
          {/* Previous page button */}
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 mr-1"
          >
            <IoIosArrowBack />
          </button>

          {/* Current page indicator */}
          <div className="border border-black px-4 rounded-md">
            <p>{currentPage}</p>
          </div>

          {/* Next page button */}
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 ml-1"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    );
  }
);

export default Pagination;

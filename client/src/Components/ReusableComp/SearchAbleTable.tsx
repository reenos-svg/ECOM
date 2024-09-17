import { FC, memo, useCallback, useMemo, useState } from "react";
import SearchInput from "./SearchInput";
import DropDownFilter from "./DropDownFilter";
import Table, { TabelProps } from "./Tabel";
import { CommonKeyValueType } from "./TablePropsType";
import { TData } from "./TablePropsType";
import Loader from "./Loader";

// Interface for SearchableTableProps that extends TabelProps interface
interface SearchAbleTableProps extends TabelProps {
  categoryDropDownPlaceHolder?: string;
  searchInputPlaceHolder: string;
  messageText: string;
  categoryDropDownData?: CommonKeyValueType;
  isLoading?: boolean;
  dropDownPlaceHolder?: string;
}

// Define the Searchable Table component
const SearchAbleTable: FC<SearchAbleTableProps> = memo(
  ({
    tableData,
    tableHeading,
    tableType,
    categoryDropDownPlaceHolder = "Select a Category",
    searchInputPlaceHolder = "Search...",
    messageText = "No data available",
    categoryDropDownData,
    isLoading = false,
  }) => {
    const [categorySelectedData, setCategorySelectedData] = useState<
      string | null
    >(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      },
      []
    );

    const handleCategoryDropDownChange = useCallback((item: string) => {
      setCategorySelectedData(item === "" ? null : item);
    }, []);

    const filterData = (
      category: string | null,
      data: TData[],
      searchQuery: string,
      categoryField: string
    ): TData[] => {
      return data
        .filter((item) => (category ? item[categoryField] === category : true))
        .filter((item) => {
          const name = item.name as string | undefined;
          return name
            ? name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        });
    };

    const filteredData = useMemo((): TData[] => {
      const data = tableData || [];
      return filterData(categorySelectedData, data, searchQuery, "category");
    }, [searchQuery, categorySelectedData, tableData]);

    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between mb-3">
          {tableType === "vendorTable" ? null : (
            <div className="w-full md:w-1/2 lg:w-1/3 mb-3 md:mb-0">
              <DropDownFilter
                items={
                  categoryDropDownData ? Object.keys(categoryDropDownData) : []
                }
                selectedItem={categorySelectedData}
                onSelect={handleCategoryDropDownChange}
                placeholder={categoryDropDownPlaceHolder}
              />
            </div>
          )}
          <div className="w-[12rem] md:w-1/2 lg:w-1/3">
            <SearchInput
              placeHolder={searchInputPlaceHolder}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="mt-4">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                <Table
                  tableHeading={tableHeading}
                  tableType={tableType}
                  tableData={filteredData}
                />
              ) : (
                <p className="text-lg font-ubuntu font-medium text-gray-400 text-center mt-10">
                  {messageText}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

export default SearchAbleTable;

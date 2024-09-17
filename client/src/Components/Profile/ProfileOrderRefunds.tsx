import  { memo } from "react";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";

type Order = {
  id: number;
  date: string;
  customer: string;
  total: number;
  status: string;
};

const ProfileOrderRefunds = memo(() => {
  // Example data for orders

  // Define table headings
  const tableHeading: TableHeadingItem[] = [
    { label: "Id" },
    { label: "Name" },
    { label: "Status" },
    { label: "Recipient" },
    { label: "Sent" },
    { label: "Read" },
    { label: "Schedule Time" },
  ] as const; // Adding 'as const' for immutability

  const tableData : Order[] = [
    {
      id: 1,
      date: "2024-06-20",
      customer: "John Doe",
      total: 150,
      status: "Pending",
    },
    {
      id: 2,
      date: "2024-06-19",
      customer: "Jane Smith",
      total: 200,
      status: "Shipped",
    },
    {
      id: 3,
      date: "2024-06-18",
      customer: "Sam Brown",
      total: 100,
      status: "Delivered",
    },
    {
      id: 4,
      date: "2024-06-17",
      customer: "Alice Johnson",
      total: 180,
      status: "Pending",
    },
  ];

  // Transform unique categories into an object
  // const categoriesObject: { [key: string]: string } = useMemo(() => {
  //   const categories = campaignData?.campaignGroups?.map(
  //     (item: CampaignDataProps) => item.status
  //   ); //getting the catgeories
  //   const uniqueCategories = Array.from(new Set(categories)); // arrsy of all the unique catgeories
  //   const categoriesObj: { [key: string]: string } = {
  //     All: "All",
  //   }; // function to create the asrray of categoruies
  //   uniqueCategories.forEach((category) => {
  //     categoriesObj[category] = category;
  //   });
  //   return categoriesObj;
  // }, [campaignData]);

  return (
    <div className="flex flex-col pt-20 h-screen bg-orange-100 items-center">
      <div className="w-full max-w-3xl bg-orange-100 rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col">
          <SearchAbleTable
            tableHeading={tableHeading}
            tableData={tableData}
            tableType="campaignTable"
            dropDownPlaceHolder="Status"
            searchInputPlaceHolder="Search for the Campaign"
            messageText="No Campaign Found"
            dropDownData={{
              All: "All",
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default ProfileOrderRefunds;

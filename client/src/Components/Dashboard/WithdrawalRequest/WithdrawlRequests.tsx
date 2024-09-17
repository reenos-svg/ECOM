import { useGetWithdrawalsQuery } from "../../../Redux/rtk/withdrawalApi";
import { formatDate } from "../../../utils/FormatDate";
import Loader from "../../ReusableComp/Loader";
import RenderHeader from "../../ReusableComp/RenderHeading";
import SearchAbleTable from "../../ReusableComp/SearchAbleTable";

// Define interfaces for withdrawal data
interface Withdrawal {
  _id: string;
  vendorName: string;
  vendor: {
    _id: string;
    name: string;
  };
  amount: number;
  closingBalance?: number;
  status: string;
  date: string;
  accountHolderName: string;
  accountNumber: string;
  address: string;
  branchName: string;
  phoneNumber: string;
}

const WithdrawalRequests = () => {
  const { data, isLoading, isError } = useGetWithdrawalsQuery();

  // Define table headings
  const tableHeading = [
    { label: "Id" },
    { label: "Vendor Name" },
    { label: "Amount" },
    { label: "Closing Balance" },
    { label: "Status" },
    { label: "Requested Date" },
  ] as const; // Adding 'as const' for immutability

  // Transform the API data to match the expected format
  const tableData =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data?.map((item: Withdrawal) => ({
      vendorId: item.vendor?._id,
      id: item._id,
      vendorName: item.vendorName,
      amount: item.amount,
      closingBalance: item.closingBalance, // Adjust this if closing balance data is available
      status: item.status,
      requestedDate: formatDate(item.date), // Format the date
    })) || [];

  // Show loader if data is being fetched
  if (isLoading) {
    return <Loader />;
  }

  // Show error message if data fetch fails
  if (isError) {
    return <div>Error loading withdrawals</div>;
  }

  // Transform unique categories into an object
  const categoriesObject = () => {
    // Using reduce to accumulate unique categories into an object
    const categoriesObj = tableData.reduce<{ [key: string]: string }>(
      (acc, item) => {
        acc[item.status] = item.status; // Adjust based on actual category logic
        return acc;
      },
      { All: "All" }
    );
    return categoriesObj;
  };

  return (
    <>
      <div className="flex flex-col gap-10 ">
        <div className="flex flex-col items-center justify-center"></div>
        <RenderHeader subHeading="Withdrawal Requests" />
        <div className="flex flex-col">
          <SearchAbleTable
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tableData={tableData}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tableHeading={tableHeading}
            tableType="withdrawalRequestTable" // Adjust the table type as needed
            categoryDropDownPlaceHolder="Select a Status"
            searchInputPlaceHolder="Search for Withdrawals"
            messageText="No data available"
            categoryDropDownData={categoriesObject()}
            isLoading={false} // Update this based on actual loading state if needed
          />
        </div>
      </div>
    </>
  );
};

export default WithdrawalRequests;

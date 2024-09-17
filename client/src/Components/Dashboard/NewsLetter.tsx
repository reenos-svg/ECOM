import { memo } from "react";
import { useGetEmailsQuery } from "../../Redux/rtk/newsLetterApi";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";
import RenderHeader from "../ReusableComp/RenderHeading";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import { handleError } from "../../utils/errorHandler"; // Assuming you have this utility

// Define the type for individual email
interface Email {
  _id: string;
  address: string;
}

const NewsLetter = memo(() => {
  // Fetch the data with the type definition
  const { data, error, isLoading } = useGetEmailsQuery("");


  // Define the table headings
  const tableHeading: TableHeadingItem[] = [
    { label: "Sno." },
    { label: "Email Id" },
    { label: "Email Address" },
  ] as const;

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {handleError(error)}</div>; // Using handleError utility

  // Transform the email data into the format required by SearchAbleTable
  const tableData =
    data?.emails.map((email: Email, index: number) => ({
      sno: index + 1,
      id: email._id,
      emailAddress: email.address,
    })) || [];

  return (
    <div className="flex flex-col gap-4">
      <RenderHeader subHeading="Subscriptions" />
      <div className="flex flex-col">
        <SearchAbleTable
          tableHeading={tableHeading}
          tableData={tableData}
          tableType="emailTable"
          dropDownPlaceHolder="Filter by Email"
          searchInputPlaceHolder="Search for Emails"
          messageText="No Emails Found"
        />
      </div>
    </div>
  );
});

export default NewsLetter;

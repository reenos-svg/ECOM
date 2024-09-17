import { FC } from "react";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import RenderHeader from "../ReusableComp/RenderHeading";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";
import Loader from "../ReusableComp/Loader";
import { useGetAllVendorsQuery } from "../../Redux/rtk/vendorApi";

export interface VendorProps {
  _id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  zipcode: number;
}

const AllVendors: FC = () => {
  // const { user } = useSelector(selectUserDetails);
  const { data: vendorData, isLoading, isError } = useGetAllVendorsQuery();

  // Define table headings
  const tableHeading: TableHeadingItem[] = [
    { label: "Vendor Id" },
    { label: "Vendor Name" },
    { label: "Vendor Email" },
    { label: "Vendor Zipcode" },
    { label: "Vendor" },
    { label: "Subcategory" },
  ] as const; // Adding 'as const' for immutability

  // Assuming the products are in an array format
  const vendors = vendorData?.vendors || [];

  // Transform the API data to match the expected format
  const tableData = vendors.map((vendor: VendorProps) => ({
    vendorId: vendor._id,
    vendorName: vendor.name,
    vendorEmail: vendor.email,
    vendorZipcode: vendor.zipcode,
  }));

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <RenderHeader heading="Vendors" />
      <div className="flex flex-col">
        <SearchAbleTable
          tableData={tableData}
          tableHeading={tableHeading}
          tableType="vendorTable"
          searchInputPlaceHolder="Search for Vendors"
          messageText="No data available"
          isLoading={false}
          categoryDropDownPlaceHolder={""}
        />
      </div>
    </div>
  );
};

export default AllVendors;

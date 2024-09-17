import React from "react";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import RenderHeader from "../ReusableComp/RenderHeading";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";
import { formatDate } from "../../utils/FormatDate";
import { useGetUserOrdersQuery } from "../../Redux/rtk/userApi";
import { useSelector } from "react-redux";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";

type orderItems = {
  _id: string;
  orderItems: { product: string }[]; // Adjust this based on your actual data structure
  totalPrice: string;
  shippingInfo: {
    firstName: string;
  };
  createdAt: string;
  orderStatus: string;
};

const UserOrders: React.FC = () => {
  const tableHeading: TableHeadingItem[] = [
    { label: "Order Id" },
    { label: "Customer Name" },
    { label: "Number of products" },
    { label: "Order total" },
    { label: "Date" },
    { label: "Status" },
  ] as const;

  const { id } = useSelector(selectUserDetails);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { data, error, isLoading } = useGetUserOrdersQuery(id);

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;
  // Handle error state
  if (error) return <div>Error loading orders</div>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // Transform the orders data to match the expected format for the table
  const tableData = data?.map((order: orderItems) => ({
    orderId: order._id,
    customerName: order.shippingInfo.firstName,
    numberOfProducts: order.orderItems.length,
    orderTotal: order.totalPrice,
    date: formatDate(order.createdAt),
    status: order.orderStatus,
  }));

  // Transform unique categories into an object
  const categoriesObject = () => {
    // Using reduce to accumulate unique categories into an object
    const categoriesObj = tableData?.reduce<{ [key: string]: string }>(
      (acc, item) => {
        acc[item.status] = item.status; // Add each category to the accumulator object
        return acc;
      },
      { All: "All" }
    );
    return categoriesObj;
  };

  return (
    <div className="flex flex-col gap-4">
      <RenderHeader heading="Orders" />
      <div className="flex flex-col">
        <SearchAbleTable
          tableHeading={tableHeading}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          tableData={tableData}
          tableType="userOrdersTable"
          dropDownPlaceHolder="Status"
          searchInputPlaceHolder="Search for Orders"
          messageText="No Orders Found"
          categoryDropDownData={categoriesObject()}
        />
      </div>
    </div>
  );
};

export default UserOrders;

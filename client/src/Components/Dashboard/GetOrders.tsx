import React from "react";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import RenderHeader from "../ReusableComp/RenderHeading";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";
import { useGetAllOrdersQuery } from "../../Redux/rtk/orderApi";
import { formatDate } from "../../utils/FormatDate";

type Order = {
  _id: string;
  customerName: string;
  numberOfProducts: number;
  orderTotal: number;
  date: string;
  orderStatus: string;
  totalPrice: string;
  orderItems: string[];
  shippingInfo: {
    firstName: string;
  };
  createdAt: string;
};

const GetOrders: React.FC = () => {
  const tableHeading: TableHeadingItem[] = [
    { label: "Order Id" },
    { label: "Customer Name" },
    { label: "Number of products" },
    { label: "Order total" },
    { label: "Date" },
    { label: "Status" },
  ] as const;

  const { data: ordersData, error, isLoading } = useGetAllOrdersQuery("");

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;
  // Handle error state
  if (error) return <div>Error loading orders</div>;

  // Assuming API returns an array of order objects
  const orders = ordersData?.orders || [];

  // Transform the orders data to match the expected format for the table
  const tableData = orders.map((order: Order) => ({
    orderId: order._id,
    customerName: order.shippingInfo.firstName,
    numberOfProducts: order.orderItems.length,
    orderTotal: order.totalPrice,
    date: formatDate(order.createdAt),
    status: order.orderStatus,
  }));

  return (
    <div className="flex flex-col gap-4">
      <RenderHeader
        heading="Listed Orders"
        description="Below are all the orders listed by you"
      />
      <div className="flex flex-col">
        <SearchAbleTable
          tableHeading={tableHeading}
          tableData={tableData}
          tableType="ordersTable"
          dropDownPlaceHolder="Status"
          searchInputPlaceHolder="Search for Orders"
          messageText="No Orders Found"
        />
      </div>
    </div>
  );
};

export default GetOrders;

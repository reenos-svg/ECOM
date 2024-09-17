import { memo } from "react";
import RevenueOrdersChart from "../RevenueOrdersChart";
import Card from "./Card";
import { TableHeadingItem } from "../../ReusableComp/TablePropsType";
import { useFetchRecentProductsQuery } from "../../../Redux/rtk/productApi";
import SearchAbleTable from "../../ReusableComp/SearchAbleTable";
import { useParams } from "react-router-dom";
import { useGetOrdersSummaryQuery } from "../../../Redux/rtk/vendorApi";
import {
  useGetRecentOrdersByVendorIdQuery,
  useGetOrderValuesLast6MonthsQuery,
} from "../../../Redux/rtk/orderApi";
import { handleError } from "../../../utils/errorHandler";

// Define the type for an individual order item
export type OrderItem = {
  _id: string;
  product: string;
  quantity: number;
  price: number;
};

// Define the type for shipping information
export type ShippingInfo = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

// Define the type for a single order
export type Order = {
  _id: string;
  vendor: string;
  customer: string;
  totalPrice: number;
  totalPriceAfterDiscount: number;
  orderItems: OrderItem[];
  orderStatus: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  shippingCharges: number;
  shippingInfo: ShippingInfo;
  discountOnOrder: number;
  user: string;
  __v: number;
};

export type OrderSummaryProps = {
  month: string;
  totalOrderValue: string;
  year: string;
};
// Define the type for the API response
export type RecentOrdersResponse = {
  orders: Order[];
};

const DashboardOverview = memo(() => {
  const { id } = useParams();
  const { data: orderValuesData } = useGetOrderValuesLast6MonthsQuery("");
  const { data: productData } = useFetchRecentProductsQuery({ id });
  const { data } = useGetOrdersSummaryQuery("");

  const {
    data: recentOrdersData,
    error,
    isLoading,
  } = useGetRecentOrdersByVendorIdQuery(id || "");

  // Prepare the chart data
  const chartData = {
    name: "Revenue",
    labels:
      orderValuesData?.orderValues.map(
        (item: OrderSummaryProps) => `${item.month}-${item.year}`
      ) || [],
    revenue:
      orderValuesData?.orderValues.map(
        (item: OrderSummaryProps) => item.totalOrderValue
      ) || [],
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {handleError(error)}</div>;

  // Define table headings
  const tableHeading: TableHeadingItem[] = [
    { label: "Order Id" },
    { label: "Customer" },
    { label: "Total" },
    { label: "Number of products" },
    { label: "Date" },
    { label: "Status" },
  ] as const;

  // Transform the fetched data to match the expected format
  const tableData =
    recentOrdersData?.orders.map((order: Order) => ({
      id: order._id,
      customer: order.shippingInfo.firstName,
      total: order.totalPriceAfterDiscount,
      numberOfProducts: order.orderItems.length,
      date: new Date(order.paidAt).toLocaleDateString(),
      status: order.orderStatus,
    })) || [];

  return (
    <>
      <div className="flex md:flex-row flex-col flex-wrap gap-6 py-4 md:min-w-[1200px]">
        <Card title="Total Return Orders" amount={4} type="noOfReturns" />
        <Card
          title="Total Order Value"
          amount={data?.totalValue}
          type="orderValue"
        />
        <Card
          title="Your Balance"
          amount={data?.vendorBalance.balance}
          type="yourBalance"
        />
        <Card
          title="Total Cancelled Orders"
          amount={data?.cancelledOrdersCount}
          type="cancelledOrders"
        />
        <Card
          title="Number Of Orders"
          amount={data?.totalOrders}
          type="noOfOrders"
        />
      </div>

      <div className="flex my-20 flex-col md:flex-row gap-4">
        <RevenueOrdersChart data={chartData} />
        <Card cardType="recentProducts" data={productData?.products} />
      </div>
      <div className="">
        <SearchAbleTable
          tableHeading={tableHeading}
          tableData={tableData}
          tableType="recentOrdersTable"
          dropDownPlaceHolder="Status"
          searchInputPlaceHolder="Search for the Orders"
          messageText="No Orders Found"
        />
      </div>
    </>
  );
});

export default DashboardOverview;

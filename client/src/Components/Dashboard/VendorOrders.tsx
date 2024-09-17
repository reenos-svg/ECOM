import React from "react";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import RenderHeader from "../ReusableComp/RenderHeading";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";
import { useGetAllOrdersByVendorQuery } from "../../Redux/rtk/vendorApi";
import { useParams } from "react-router-dom";

type OrderItems = {
  _id: string;
  customerName: string;
  numberOfProducts: number;
  totalPrice: number;
  createdAt: string;
  shippingInfo: {
    address: string;
    city: string;
    firstName: string;
    lastName: string;
    other: string;
    pincode: number;
    state: string;
  };
  orderItems: {
    price: number;
    product: {
      _id: string;
      productName: string;
      discountedProductPrice: number;
    };
    quantity: number;
    vendor: string;
    _id: string;
  }[];
  orderStatus: string;
  // Define this type based on your orderItems structure
};

const VendorOrders: React.FC = () => {
  // Extract vendorId from URL params
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { id } = useParams<{ vendorId: string }>();

  // Define table heading
  const tableHeading: TableHeadingItem[] = [
    { label: "Order Id" },
    { label: "Customer Name" },
    { label: "Number of products" },
    { label: "Order total" },
    { label: "Date" },
    { label: "Status" },
  ];

  // Fetch orders data
  const {
    data: ordersData,
    error,
    isLoading,
  } = useGetAllOrdersByVendorQuery(id);

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;

  // Handle error state
  if (error) return <div>Error loading orders</div>;

  // Transform orders data to match the table format
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const tableData = ordersData?.map((order: OrderItems) => ({
    orderId: order._id,
    customerName: order.shippingInfo.firstName,
    numberOfProducts: order.orderItems.length,
    orderTotal: order.totalPrice,
    date: order.createdAt,
    status: order.orderStatus,
  }));

  // Transform unique categories into an object
  const categoriesObject = () => {
    // Using reduce to accumulate unique categories into an object

    const categoriesObj = tableData.reduce<{ [key: string]: string }>(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (acc, item) => {
        acc[item.status] = item.status; // Adjust based on actual category logic
        return acc;
      },
      { All: "All" }
    );
    return categoriesObj;
  };

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
          categoryDropDownPlaceHolder="Status"
          searchInputPlaceHolder="Search for Orders"
          messageText="No Orders Found"
          categoryDropDownData={categoriesObject()}
        />
      </div>
    </div>
  );
};

export default VendorOrders;

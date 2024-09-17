import React from "react";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import RenderHeader from "../ReusableComp/RenderHeading";
import { TableHeadingItem } from "../ReusableComp/TablePropsType";
import {
  ProductProps,
  useFetchProductsByVendorQuery,
} from "../../Redux/rtk/productApi";
import Loader from "../ReusableComp/Loader";
import { useSelector } from "react-redux";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";

type Product = {
  productImage: string;
  vendorId: string;
  vendorName: string;
  productName: string;
  price: number;
  category: string;
  subCategory?: string;
};

const GetProducts: React.FC = () => {
  const { id } = useSelector(selectUserDetails);
  const {
    data: productsData,
    isLoading,
    isError,
  } = useFetchProductsByVendorQuery(id);

  // Define table headings
  const tableHeading: TableHeadingItem[] = [
    { label: "Product Image" },
    { label: "Vendor" },
    { label: "Product Name" },
    { label: "Price" },
    { label: "Category" },
    { label: "Subcategory" },
  ] as const; // Adding 'as const' for immutability

  // Assuming the products are in an array format
  const products = productsData?.products || [];

  // Transform the API data to match the expected format
  const tableData: Product[] = products.map((product: ProductProps) => ({
    productId: product._id,
    productImage: product.productImages[0], // Assuming the API returns an array of image URLs
    vendorId: product.vendorId?._id,
    vendorName: product.vendorId?.name,
    productName: product.productName,
    price: product.productPrice,
    category: product.productCategory?.name, // Accessing the category name from the object
    subCategory: product.productSubCategory?.name, // Update if there's an actual subcategory field
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

  // Transform unique categories into an object
  const categoriesObject = () => {
    // Using reduce to accumulate unique categories into an object
    const categoriesObj = tableData.reduce<{ [key: string]: string }>(
      (acc, item) => {
        acc[item.category] = item.category; // Add each category to the accumulator object
        return acc;
      },
      { All: "All" }
    );
    return categoriesObj;
  };

  return (
    <div className="flex flex-col gap-4">
      <RenderHeader
        heading="Listed Products"
        description="Below are all the products listed by you"
      />
      <div className="flex flex-col">
        <SearchAbleTable
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          tableData={tableData}
          tableHeading={tableHeading}
          tableType="productsTable"
          categoryDropDownPlaceHolder="Select a Category"
          searchInputPlaceHolder="Search for Products"
          messageText="No data available"
          categoryDropDownData={categoriesObject()}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default GetProducts;

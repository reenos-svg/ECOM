import { memo } from "react";
import ProductCard from "../ProductCard/ProductCard";
import RenderHeader from "../ReusableComp/RenderHeading";
import Button from "../ReusableComp/Button";
import {
  ProductProps,
  useFetchAllProductsQuery,
} from "../../Redux/rtk/productApi";
import SpinLoader from "../ReusableComp/SpinLoader";
import { useNavigate } from "react-router-dom";

const Featured = memo(() => {
  // Fetch products data with proper type handling
  const { data, isLoading, isError } = useFetchAllProductsQuery({});

  const navigate = useNavigate();
  // Assuming the API response is an object with a "products" field
  const products = data?.products || [];

  // Filter featured products
  const filteredProducts = products.filter(
    (e: ProductProps) => e?.isFeatured === true
  ).splice(0,5);

  const handleViewMoreClick = () => {
    navigate("/shop-products");
  };

  const headerData = {
    heading: "Featured Products",
    btnComponent: (
      <Button
        btnContent="View More"
        btnType="shop"
        btnOnClick={handleViewMoreClick}
      />
    ),
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <SpinLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading featured products. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <RenderHeader
        heading={headerData.heading}
        buttonComponent={headerData.btnComponent}
      />
      {filteredProducts.length === 0 ? (
        <div className="text-center">
          No featured products available at the moment.
        </div>
      ) : (
        <div className="flex flex-row  items-center overflow-x-auto gap-4">
          {filteredProducts.map((data: ProductProps) => (
            <ProductCard
              productId={data._id}
              key={data._id}
              productName={data.productName}
              productImages={data.productImages}
              productPrice={data.productPrice}
              productOldPrice={data.productPrice}
              productDescription={data.productDescription}
              isFeatured={data?.isFeatured}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default Featured;

import { useParams } from "react-router-dom";
import DisplayProduct from "../../Components/DisplayProduct/DisplayProduct";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useFetchAllProductsQuery, ProductProps } from "../../Redux/rtk/productApi";
import Loader from "../../Components/ReusableComp/Loader";
import { memo } from "react";

const Product = memo(() => {
  const { productId } = useParams();
  const { data, isLoading, isError } = useFetchAllProductsQuery({});

  // Assuming the API response is an object with a "products" field
  const products = data?.products || [];
  const product = products.find((e: ProductProps) => e._id === productId);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <Loader />
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Navbar />
        <div>Error loading product.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {product ? <DisplayProduct product={product} /> : <div>Product not found.</div>}
      <Footer />
    </div>
  );
});

export default Product;

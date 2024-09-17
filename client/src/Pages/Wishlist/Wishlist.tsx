import { memo } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import { selectWishlistProductDetails } from "../../Redux/selector/SelectWishlistData";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import empty from '../../assets/emptyWish.png';

const Wishlist = memo(() => {
  const wishlistItems = useSelector(selectWishlistProductDetails);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center min-h-screen  p-10  ">
        {wishlistItems.length > 0 ? (
          <div className="border-2 border-white rounded-xl p-4 shadow-xl flex flex-row flex-wrap gap-4  w-9/12">
            {wishlistItems.map((product) => (
              <ProductCard
                productId={product.productId}
                productName={product.productName}
                productImages={product.productImages}
                productPrice={product.productPrice}
                productOldPrice={product.productOldPrice}
                productDescription={product.productDescription}               />
            ))}
          </div>
        ) : (
          <div className="minh-screen flex flex-col py-10 items-center justify-center">
            <img src={empty} alt="" />
            <p className=" font-ubuntu font-semibold text-2xl ">
              Your Wishlist Is Empty....
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
});

export default Wishlist;

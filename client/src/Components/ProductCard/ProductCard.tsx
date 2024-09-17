import { FC, memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ReusableComp/Button";
import { HeartIcon } from "../Icons/Icons";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlist,
} from "../../Redux/slice/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";

interface ProductCardProps {
  productId: string | number;
  productImages: string[] | string;
  productName: string;
  productDescription?: string;
  productPrice: number;
  productOldPrice?: number;
  isFeatured?: boolean;
}

const ProductCard: FC<ProductCardProps> = memo(
  ({
    productId,
    productImages,
    productName,
    productDescription,
    productPrice,
    productOldPrice,
    isFeatured,
  }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlist = useSelector(selectWishlist);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
      setIsInWishlist(wishlist.some((item) => item.productId === productId));
    }, [wishlist, productId]);

    const handleProductClick = useCallback(() => {
      const name = productName.replace(/ /g, "-");
      navigate(`/product/${name}/${productId}`);
      window.scrollTo(0, 0);
    }, [navigate, productName, productId]);

    const handleAddWishlistClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setAnimate(true);
        if (isInWishlist) {
          dispatch(removeFromWishlist(productId));
        } else {
          dispatch(
            addToWishlist({
              productId,
              productName,
              productDescription,
              productPrice,
              productImages,
            })
          );
        }
        setTimeout(() => setAnimate(false), 300); // Reset animation after 300ms
      },
      [
        dispatch,
        productId,
        isInWishlist,
        productName,
        productDescription,
        productPrice,
        productImages,
      ]
    );

    return (
      <div
        className="flex flex-col gap-4 bg-white border-2 rounded-xl w-60 p-4 font-ubuntu cursor-pointer relative"
        onClick={handleProductClick}
      >
        <div className="absolute right-2 top-2">
          <Button
            btnType="normal"
            btnIcon={<HeartIcon active={isInWishlist} animate={animate} />}
            btnOnClick={handleAddWishlistClick}
          />
        </div>
        <div className="h-60 w-52">
          <img
            src={productImages[0]}
            alt={productName}
            className="rounded-xl object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <div className="flex  flex-col mt-2">
          {isFeatured ? (
            <span className="font-ubuntu w-24 text-center text-md text-orange-500 bg-orange-100 rounded-xl">
              Featured
            </span>
          ) : null}
          <span className="text-md font-bold">{productName}</span>
          <span className=" truncate text-md text-gray-500">
            {productDescription}
          </span>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-lg font-semibold">Rs. {productPrice}</span>
            {productOldPrice && (
              <span className="text-md font-semibold text-gray-500 line-through">
                Rs. {productOldPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ProductCard;

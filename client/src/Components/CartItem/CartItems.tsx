import { FC, memo, useCallback, useMemo } from "react";
import Button from "../ReusableComp/Button";
import {
  decrementProductQuantity,
  incrementProductQuantity,
  removeFromCart,
} from "../../Redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import { DeleteIcon } from "../Icons/Icons";

interface CartItemProps {
  productName: string;
  productImage?: string;
  productPrice: number;
  productCategory: string;
  productColor?: string | null;
  productSize?: string;
  productQuantity: number;
  productId: string;
}

const CartItems: FC<CartItemProps> = memo(
  ({
    productName,
    productId,
    productSize,
    productImage,
    productPrice,
    productColor,
    productQuantity,
    productCategory,
  }) => {
    const dispatch = useDispatch();

    const itemTotalPrice = useMemo(
      () => productPrice * productQuantity,
      [productPrice, productQuantity]
    );

    const handleIncrement = useCallback(() => {
      dispatch(incrementProductQuantity(productId));
    }, [dispatch, productId]);

    const handleDecrement = useCallback(() => {
      dispatch(decrementProductQuantity(productId));
    }, [dispatch, productId]);

    const handleDeleteCartItem = useCallback(() => {
      dispatch(removeFromCart(productId));
    }, [dispatch, productId]);

    return (
      <div className="flex flex-col md:flex-row justify-between items-center border-b-2 px-4 pb-2 mb-2">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {productImage && (
            <img
              src={productImage}
              alt="product-image"
              className="w-full md:w-44 h-44  md:h-44 object-cover rounded-xl"
              loading="lazy"
            />
          )}
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <span className="text-sm font-semibold font-ubuntu text-desc">
              {productCategory}
            </span>
            <span className="font-semibold text-lg">{productName}</span>
            {productColor && (
              <div className="flex flex-row items-center">
                <span className="text-sm font-ubuntu font-medium">
                  Color •{" "}
                </span>
                <span className="ml-1 font-ubuntu">{productColor}</span>
              </div>
            )}
            {productSize && (
              <div className="flex flex-row items-center">
                <span className="text-sm font-ubuntu font-medium">Size • </span>
                <span className="ml-1 font-ubuntu text-sm">{productSize}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row md:flex-row items-center gap-4 mt-2 md:mt-0">
          <div>
            <span className="font-semibold font-ubuntu text-lg">
              Rs. {itemTotalPrice}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              btnOnClick={handleDecrement}
              btnContent="-"
              btnType="size"
            />
            <span className="px-2">{productQuantity}</span>
            <Button
              btnOnClick={handleIncrement}
              btnContent="+"
              btnType="size"
            />
          </div>
          <div>
            <Button
              btnIcon={<DeleteIcon />}
              btnType="normal"
              btnOnClick={handleDeleteCartItem}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default CartItems;

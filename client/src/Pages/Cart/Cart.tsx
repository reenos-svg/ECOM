import { memo, useState } from "react";
import { useFormik } from "formik";
import CartItems from "../../Components/CartItem/CartItems";
import { useDispatch, useSelector } from "react-redux";
import { selectProductDetails } from "../../Redux/selector/SelectCartData";
import Button from "../../Components/ReusableComp/Button";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import empty from "../../assets/emptyCart.png";
import { setOrderSummary } from "../../Redux/slice/orderSummarySlice";
import { useApplyCouponMutation } from "../../Redux/rtk/couponApi";
import { toast } from "react-hot-toast";

const Cart = memo((): JSX.Element => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectProductDetails);
  const { id } = useSelector(selectUserDetails);
  const dispatch = useDispatch();
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.productPrice * item.productQuantity,
    0
  );

  const shippingCharges = 200;
  const [discount, setDiscount] = useState<number>(0);
  const total = subtotal + shippingCharges - discount;

  const formik = useFormik({
    initialValues: {
      couponCode: "",
    },
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await applyCoupon({
          code: values.couponCode,
          orderAmount: total,
        }).unwrap();
        if (response) {
          setDiscount(response.discount);
          toast.success(`Coupon applied! Rs. ${response.discount} discount.`);
        } else {
          setFieldError("couponCode", "Invalid Coupon Code");
          setDiscount(0);
        }
      } catch (error) {
        setFieldError("couponCode", "Failed to apply coupon code");
        setDiscount(0);
        toast.error("Failed to apply coupon code.");
        console.error("Failed to apply coupon code:", error);
      }
      setSubmitting(false);
    },
  });

  const handleCheckoutClick = () => {
    navigate(`/${id}/create-order`);
    dispatch(
      setOrderSummary({
        subtotal,
        shippingCharges,
        discount,
        total,
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col py-10 items-center justify-center">
          <img
            src={empty}
            alt="Empty Cart"
            className="w-full max-w-md p-20 md:p-0"
          />
          <p className="font-ubuntu font-semibold text-2xl mt-6">
            Your Cart Is Empty...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-grow">
          <div className="px-4 flex flex-col gap-2 mt-6 justify-center py-2">
            <h1 className="font-ubuntu font-semibold md:text-2xl text-lg">
              Your Shopping Cart
            </h1>
            <p className="font-ubuntu text-desc font-medium text-md md:text-xl">
              {cartItems.length} Items in your cart
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-around px-4 md:px-8 lg:px-16 flex-grow">
            <div className="border-2 border-white rounded-xl p-4 shadow-xl md:w-8/12 flex-grow">
              {cartItems.map((item) => (
                <CartItems
                  productId={item.productId}
                  key={item.productId}
                  productCategory={item.productCategory}
                  productColor={item.productColor}
                  productSize={item.productSize}
                  productImage={item.productImage}
                  productName={item.productName}
                  productPrice={item.productPrice}
                  productQuantity={item.productQuantity}
                />
              ))}
            </div>

            <div className="border-2 bg-white md:w-4/12 border-white rounded-xl p-4 flex flex-col justify-around gap-10 items-center shadow-xl mt-4 md:mt-0">
              <div className="flex flex-col gap-4 w-full">
                <h1 className="font-ubuntu font-semibold text-xl">
                  Coupon Code
                </h1>
                <h3 className="font-ubuntu text-gray-400 text-sm">
                  <em>
                    Enter your coupon code to receive a discount on your order.
                    Apply it before checkout to see your savings.
                  </em>
                </h3>
                <form onSubmit={formik.handleSubmit} className="w-full">
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      name="couponCode"
                      onChange={formik.handleChange}
                      value={formik.values.couponCode}
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                    />
                    <Button
                      btnContent="Apply Coupon"
                      btnType="submit"
                      disabled={isLoading || formik.isSubmitting}
                    />
                  </div>
                  {formik.errors.couponCode && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.couponCode}
                    </p>
                  )}
                </form>
                {formik.values.couponCode && discount > 0 && (
                  <p className="text-sm text-green-400 mt-2">
                    <span>
                      <em>
                        {" "}
                        Rs. {discount} off using the{" "}
                        <code>{formik.values.couponCode}</code>
                      </em>
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-col bg-orange-300 rounded-lg p-4 w-full">
                <h1 className="font-ubuntu font-semibold text-xl mb-4">
                  Cart Total
                </h1>
                <div className="px-2">
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Subtotal
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      Rs. {subtotal}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Shipping Charges
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      Rs. {shippingCharges}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex flex-row items-center justify-between">
                      <span className="text-lg font-ubuntu font-medium">
                        Discount
                      </span>
                      <span className="text-lg font-ubuntu font-semibold">
                        Rs. {discount}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-row items-center justify-between mt-4">
                    <span className="text-lg font-ubuntu font-semibold">
                      Total
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      Rs. {total}
                    </span>
                  </div>
                  <div className="flex items-center justify-center mt-8">
                    <Button
                      btnContent="Checkout"
                      btnOnClick={handleCheckoutClick}
                      btnType="checkout"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
});

export default Cart;

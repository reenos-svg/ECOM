import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import { useCreateOrderMutation } from "../../Redux/rtk/userApi";
import * as Yup from "yup";
import { selectProductDetails } from "../../Redux/selector/SelectCartData";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import RadioButton from "./RadioButton"; // Adjust the import path as necessary
import OrderSummaryItem from "./OrderSummaryItem";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { selectOrderDetails } from "../../Redux/selector/selectOrderSummaryData";
import { useGetKeyQuery } from "../../Redux/rtk/paymentApi";

interface FormValues {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  other: string;
  phoneNumber: string;
  pincode: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  other: Yup.string().required("Additional Info is required"),
  pincode: Yup.number().required("Pincode is required").positive().integer(),
  phoneNumber: Yup.string().required("Phone Number is required"),
  razorpayOrderId: Yup.string(),
  razorpayPaymentId: Yup.string(),
});

const CreateOrder: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("Online Delivery");
  const cartItems = useSelector(selectProductDetails);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { id } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // const vendorId = cartItems.length > 0 ? cartItems[0].productVendor._id : "";
  const orderDetails = useSelector(selectOrderDetails);

  const [createOrder, { isLoading, isError, isSuccess }] =
    useCreateOrderMutation();
  const { data } = useGetKeyQuery("");
  console.log(id);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    state: "",
    other: "",
    pincode: 0,
    razorpayOrderId: "",
    razorpayPaymentId: "",
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadScript = async () => {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
      }
    };
    loadScript();
  }, []);

  const handleSubmit = async (values: FormValues) => {
    const { razorpayOrderId, razorpayPaymentId, ...shippingInfo } = values;
    const ordersByVendor = cartItems.reduce((acc, item) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error

      const vendorId = item.productVendor._id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error

      if (!acc[vendorId]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error

        acc[vendorId] = [];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error

      acc[vendorId].push(item);
      return acc;
    }, {});

    try {
      if (paymentMethod === "Online Payment") {
        const res = await loadRazorpayScript();
        if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
        }

        const options = {
          key: data.key,
          amount: orderDetails.total * 100,
          currency: "INR",
          name: "Aarem",
          description: "Test Transaction",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          handler: async (response) => {
            const { razorpay_order_id, razorpay_payment_id } = response;

            for (const [vendorId, items] of Object.entries(ordersByVendor)) {
              await createOrder({
                userId: id,
                vendorId,
                orderData: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  shippingInfo,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  orderItems: items.map((item) => ({
                    product: item.productId,
                    vendor: item.productVendor._id,
                    quantity: item.productQuantity,
                    price: item.productPrice,
                    size: item.productSize,
                    color: item.productColor,
                  })),
                  totalPrice: orderDetails.subtotal,
                  totalPriceAfterDiscount: orderDetails.total,
                  shippingCharges: orderDetails.shippingCharges,
                  discountOnOrder: orderDetails.discount,
                  modeOfPayment: paymentMethod,
                  paymentInfo: {
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                  },
                },
              }).unwrap();
            }

            toast.success("Order placed successfully!");
            navigate("/order-success");
          },
          prefill: {
            name: `${values.firstName} ${values.lastName}`,
            contact: values.phoneNumber,
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        for (const [vendorId, items] of Object.entries(ordersByVendor)) {
          await createOrder({
            userId: id,
            vendorId,
            orderData: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              shippingInfo,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              orderItems: items.map((item) => ({
                product: item.productId,
                vendor: item.productVendor._id,
                quantity: item.productQuantity,
                price: item.productPrice,
                size: item.productSize,
                color: item.productColor,
              })),
              totalPrice: orderDetails.subtotal,
              totalPriceAfterDiscount: orderDetails.total,
              shippingCharges: orderDetails.shippingCharges,
              discountOnOrder: orderDetails.discount,
              modeOfPayment: paymentMethod,
              paymentInfo: {
                razorpayOrderId,
                razorpayPaymentId,
              },
            },
          }).unwrap();
        }

        toast.success("Order placed successfully!");
        navigate("/order-success");
      }
    } catch (error) {
      toast.error("Failed to place the order");
      console.error("Failed to place the order:", error);
    }
  };

  const handleCancelOrder = () => {
    navigate("/cart");
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row p-4 gap-4 min-h-screen w-full">
        <Toaster />
        <div className="md:w-1/2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="bg-gray-100 p-4 rounded-xl">
                <h1 className="font-ubuntu font-semibold text-3xl">
                  Delivery Information
                </h1>
                <div className="flex flex-col md:flex-row gap-6 md:items-center p-2">
                  <div className="flex flex-col gap-2 md:w-1/2">
                    <label
                      htmlFor="firstName"
                      className="font-ubuntu text-sm text-desc"
                    >
                      First Name
                    </label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:w-1/2">
                    <label
                      htmlFor="lastName"
                      className="font-ubuntu text-sm text-desc"
                    >
                      Last Name
                    </label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:w-1/2">
                    <label
                      htmlFor="lastName"
                      className="font-ubuntu text-sm text-desc"
                    >
                      Phone Number
                    </label>
                    <Field
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex md:flex-row flex-col gap-6 md:items-center p-2 flex-wrap">
                  <div className="flex flex-col gap-2 md:w-2/3">
                    <label
                      htmlFor="address"
                      className="font-ubuntu text-sm text-desc"
                    >
                      Address
                    </label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="city"
                      className="font-ubuntu text-sm text-desc"
                    >
                      City
                    </label>
                    <Field
                      type="text"
                      id="city"
                      name="city"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="state"
                      className="font-ubuntu text-sm text-desc"
                    >
                      State
                    </label>
                    <Field
                      type="text"
                      id="state"
                      name="state"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="other"
                      className="font-ubuntu text-sm text-desc"
                    >
                      Additional Info
                    </label>
                    <Field
                      type="text"
                      id="other"
                      name="other"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="other"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="pincode"
                      className="font-ubuntu text-sm text-desc"
                    >
                      Pincode
                    </label>
                    <Field
                      type="number"
                      id="pincode"
                      name="pincode"
                      className="border-2 rounded-xl h-10 px-2 outline-none"
                    />
                    <ErrorMessage
                      name="pincode"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-gray-100 p-4 flex flex-col gap-2 rounded-xl">
                <h2 className="font-ubuntu font-semibold text-xl">
                  Payment Method
                </h2>
                <div className="flex flex-row gap-6 items-center">
                  <RadioButton
                    id="onlinePayment"
                    name="paymentMethod"
                    value="Online Payment"
                    label="Online Payment"
                    checked={paymentMethod === "Online Payment"}
                    onChange={setPaymentMethod}
                  />
                  <RadioButton
                    id="cashOnDelivery"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    label="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={setPaymentMethod}
                  />
                </div>
              </div>

              {/* {paymentMethod === "Online Delivery" && (
              <div>
                <label htmlFor="razorpayOrderId" className="block mb-2">
                  Razorpay Order ID
                </label>
                <Field
                  type="text"
                  id="razorpayOrderId"
                  name="razorpayOrderId"
                  className="input"
                />
                <ErrorMessage
                  name="razorpayOrderId"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            )}
            {paymentMethod === "Online Delivery" && (
              <div>
                <label htmlFor="razorpayPaymentId" className="block mb-2">
                  Razorpay Payment ID
                </label>
                <Field
                  type="text"
                  id="razorpayPaymentId"
                  name="razorpayPaymentId"
                  className="input"
                />
                <ErrorMessage
                  name="razorpayPaymentId"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            )} */}

              <div className="flex flex-row gap-5 items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 bg-black text-white md:w-1/2 p-2 rounded-xl"
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </button>
                <button
                  type="submit"
                  className="mt-4 bg-black text-white md:w-1/2 p-2 rounded-xl"
                  onClick={handleCancelOrder}
                >
                  Cancel
                </button>
              </div>
              {isError && (
                <div className="text-red-500 mt-2">
                  Failed to place the order
                </div>
              )}
              {isSuccess && (
                <div className="text-green-500 mt-2">
                  Order placed successfully!
                </div>
              )}
            </Form>
          </Formik>
        </div>
        <div className="md:w-1/2 p-4 flex flex-col gap-4  bg-gray-100 rounded-xl">
          <h2 className="font-ubuntu font-semibold text-2xl mb-4">
            Order Summary
          </h2>
          <div className="bg-white p-4 flex flex-col  rounded-xl shadow-md">
            {cartItems.map((item) => (
              <OrderSummaryItem
                key={item.productId}
                productName={item.productName}
                productImage={item.productImage}
                productPrice={item.productPrice}
                productSize={item.productSize}
              />
            ))}
            <div className="flex flex-col bg-orange-300 rounded-lg  justify-center px-4 gap-4">
              <h1 className="font-ubuntu font-semibold text-xl ">
                Order Total
              </h1>
              <div className="px-2">
                <div className="flex flex-row items-center justify-between">
                  <span className="text-lg font-ubuntu font-medium">
                    Subtotal{" "}
                  </span>
                  <span className="text-lg font-ubuntu font-semibold">
                    Rs. {orderDetails.subtotal}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span className="text-lg font-ubuntu font-medium">
                    Shipping Charges{" "}
                  </span>
                  <span className="text-lg font-ubuntu font-semibold">
                    Rs. {orderDetails.shippingCharges}
                  </span>
                </div>

                {orderDetails.discount > 0 && (
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Discount{" "}
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      Rs. {orderDetails.discount}
                    </span>
                  </div>
                )}

                <div className="flex flex-row items-center justify-between">
                  <span className="text-lg font-ubuntu font-semibold">
                    Total{" "}
                  </span>
                  <span className="text-lg font-ubuntu font-semibold">
                    Rs. {orderDetails.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateOrder;

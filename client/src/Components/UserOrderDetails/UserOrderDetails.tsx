import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../Redux/rtk/orderApi";
import { toast } from "react-hot-toast";
import RenderHeader from "../ReusableComp/RenderHeading";
import Button from "../ReusableComp/Button";
import OrderItem, {
  OrderItemProps,
} from "../ReusableComp/OrderDetails/OrderItem";
import OrderTracking from "./OrderTracking";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Loader from "../ReusableComp/Loader";
import CustomModal from "../ReusableComp/CustomModal";

const UserOrderDetails = memo(() => {
  const { id } = useParams();
  const { data: orderData, error, isLoading } = useGetOrderByIdQuery(id);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmCancelOrder = () => {
    setIsModalOpen(true);
  };

  const handleCancelOrder = async () => {
    try {
      await updateOrderStatus({
        orderId: id,
        orderStatus: "Cancelled",
      }).unwrap();
      toast.success("Order cancelled successfully!");
    } catch (error) {
      toast.error("Failed to cancel the order. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div>Error loading order details.</div>;
  if (!orderData) return null;

  const isStatusChangeable =
    orderData.order.orderStatus !== "Cancelled" &&
    orderData.order.orderStatus !== "On the way" &&
    orderData.order.orderStatus !== "Delivered";

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-8 flex flex-col gap-6">
        <RenderHeader heading="Order Details" />

        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/5 flex flex-col gap-6">
            <div className="border-2 rounded-xl p-4 md:p-6 flex flex-col gap-4">
              <RenderHeader subHeading={`Order Number ${id}`} />
              <div className="flex justify-end gap-4 items-center">
                <Button
                  btnOnClick={() => {
                    console.log("Track Order Clicked");
                  }}
                  btnContent="Track Order"
                />
                {isStatusChangeable && (
                  <Button
                    btnOnClick={handleConfirmCancelOrder}
                    btnContent="Cancel Order"
                  />
                )}

                <CustomModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <h2 className="text-xl font-ubuntu font-semibold mb-4">
                    Confirm Delete
                  </h2>
                  <p className="mb-4 font-ubuntu text-desc">
                    Are you sure you want to cancel your order? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end gap-4">
                    <Button
                      btnOnClick={() => setIsModalOpen(false)}
                      btnContent="Dismiss"
                    />
                    <Button
                      btnOnClick={handleCancelOrder}
                      btnContent="Cancel Order"
                    />
                  </div>
                </CustomModal>
              </div>
              {orderData.order.orderItems?.map(
                (item: OrderItemProps, index: number) => (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  <OrderItem key={index} item={item} />
                )
              )}
              <div className="flex flex-col bg-orange-300 rounded-lg md:w-[40%] w-full justify-center px-4 gap-4">
                <div className="px-2">
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Subtotal{" "}
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      Rs. {orderData.order.totalPrice}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Shipping Charges{" "}
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      Rs. {orderData.order.shippingCharges}
                    </span>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-semibold">
                      Total{" "}
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      Rs. {orderData.order.totalPriceAfterDiscount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 rounded-xl p-4 md:p-6 flex flex-col gap-4">
              <RenderHeader subHeading="Customer Details" />
              <div className="flex flex-col md:flex-row gap-6 md:gap-20">
                <div className="flex flex-col gap-4 md:w-1/2">
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Name
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      {orderData.order.shippingInfo.firstName}{" "}
                      {orderData.order.shippingInfo.lastName}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Phone Number
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      {orderData.order.shippingInfo.phoneNumber}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Address
                    </span>
                    <span className="text-lg font-ubuntu w-[50%] font-semibold">
                      {orderData.order.shippingInfo.address}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      City
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      {orderData.order.shippingInfo.city}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:w-1/2">
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      State
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      {orderData.order.shippingInfo.state}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Landmark
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      {orderData.order.shippingInfo.other}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Pincode
                    </span>
                    <span className="text-lg font-ubuntu font-semibold">
                      {orderData.order.shippingInfo.pincode}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg font-ubuntu font-medium">
                      Status
                    </span>
                    <span
                      className={`text-lg font-ubuntu font-semibold ${
                        orderData.order.orderStatus === "Ordered"
                          ? "bg-yellow-200 px-3 py-2 w-24 text-center rounded-xl"
                          : orderData.order.orderStatus === "Processing"
                          ? "bg-blue-200 px-3 py-2 w-24 text-center rounded-xl"
                          : orderData.order.orderStatus === "Delivered"
                          ? "bg-green-200 px-3 py-2 w-24 text-center rounded-xl"
                          : orderData.order.orderStatus === "Cancelled"
                          ? "bg-red-200 px-3 py-2 w-24 text-center rounded-xl"
                          : null
                      }`}
                    >
                      {orderData.order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-2/5 w-full border-2 rounded-xl">
            <OrderTracking status={orderData.order.orderStatus} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
});

export default UserOrderDetails;

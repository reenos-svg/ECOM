import { FC, memo, useEffect, useState } from "react";
import { formatDate } from "../../../utils/FormatDate";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../../Redux/rtk/orderApi";
import { CrossIcon } from "../../Icons/Icons";
import StatusDropdown from "./StatusDropdown";
import OrderItem from "./OrderItem";
import { toast } from "react-hot-toast";

interface OrderDetailsModalProps {
  content: {
    orderId: string;
    createdAt: string;
    orderItems: Array<{ [key: string]: string | number }>;
    orderStatus: string;
    paidAt: string;
    paymentInfo: { razorpayOrderId: string; razorpayPaymentId: string };
    shippingInfo: {
      firstName?: string;
      lastName?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
    totalPrice: number;
    totalPriceAfterDiscount: number;
    updatedAt: string;
    shippingCharges: string;
    discountOnOrder: string;
    user: string;
    __v: number;
  };
  onClose: () => void;
}

const OrderDetailsModal: FC<OrderDetailsModalProps> = memo(
  ({ content, onClose }) => {
    const {
      data: orderData,
      error,
      isLoading,
      refetch,
    } = useGetOrderByIdQuery(content.orderId);
    const [updateOrderStatus, { isLoading: isUpdating }] =
      useUpdateOrderStatusMutation();
    const [status, setStatus] = useState<string>(content.orderStatus);
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);

    useEffect(() => {
      if (status !== content.orderStatus) {
        setShowUpdateButton(true);
      } else {
        setShowUpdateButton(false);
      }
    }, [status, content.orderStatus]);

    const handleStatusChange = (newStatus: string) => {
      setStatus(newStatus);
    };

    const handleUpdateStatus = async () => {
      try {
        await updateOrderStatus({
          orderId: content.orderId,
          orderStatus: status,
        }).unwrap();
        toast.success("Order status updated successfully!");
        setShowUpdateButton(false);
        refetch();
      } catch (err) {
        toast.error("Failed to update order status. Please try again.");
      }
    };

    if (isLoading || isUpdating) return <div>Loading...</div>;
    if (error) return <div>Error loading order details.</div>;
    if (!orderData) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-semibold font-ubuntu mb-4">
              Order Details
            </h2>
            <button onClick={onClose} className="text-gray-600 hover:text-black">
              <CrossIcon />
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <p className="font-ubuntu text-black text-lg">
              Order ID: {orderData.order._id}
            </p>
            <p className="font-ubuntu text-black text-lg">
              Ordered on {formatDate(orderData.order.createdAt)}
            </p>
          </div>
          <div className="flex flex-col md:flex-row my-4 items-center gap-4 md:gap-10">
            <p className="font-ubuntu text-black text-lg">
              Status:
              <StatusDropdown
                currentStatus={status}
                onStatusChange={handleStatusChange}
              />
            </p>
            {showUpdateButton && (
              <button
                onClick={handleUpdateStatus}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Update Status
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex flex-col gap-2 mb-4 md:mb-0">
              <h1 className="text-xl font-semibold font-ubuntu">
                Billed Amount
              </h1>
              <p className="font-ubuntu text-black text-lg">
                Total Price: Rs. {orderData.order.totalPrice}
              </p>
              <p className="font-ubuntu text-black text-lg">
                Total Price After Discount: Rs.{" "}
                {orderData.order.totalPriceAfterDiscount}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold font-ubuntu mt-4">
                Shipping Info
              </h3>
              <p className="font-ubuntu text-desc">
                Name: {orderData.order.shippingInfo.firstName}{" "}
                {orderData.order.shippingInfo.lastName}
              </p>
              <p className="font-ubuntu text-desc md:w-80">
                Address: {orderData.order.shippingInfo.address}
              </p>
              <p className="font-ubuntu text-desc">
                City: {orderData.order.shippingInfo.city}
              </p>
              <p className="font-ubuntu text-desc">
                State: {orderData.order.shippingInfo.state}
              </p>
              <p className="font-ubuntu text-desc">
                Postal Code: {orderData.order.shippingInfo.postalCode}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold font-ubuntu mt-4">
              Payment Info
            </h3>
            <p className="font-ubuntu text-desc">
              Razorpay Order ID: {orderData.order.paymentInfo.razorpayOrderId}
            </p>
            <p className="font-ubuntu text-desc">
              Razorpay Payment ID:{" "}
              {orderData.order.paymentInfo.razorpayPaymentId}
            </p>
            <p className="font-ubuntu text-desc">
              Paid At: {formatDate(orderData.order.paidAt)}
            </p>
          </div>
          <h3 className="text-lg font-semibold font-ubuntu mt-4">
            Order Items
          </h3>
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            orderData.order.orderItems?.map((item, index: number) => (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-expect-error
              <OrderItem key={index} item={item} />
            ))
          }
        </div>
      </div>
    );
  }
);

export default OrderDetailsModal;

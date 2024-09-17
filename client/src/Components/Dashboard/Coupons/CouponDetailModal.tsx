import { FC, memo, useEffect, useState } from "react";
import { CrossIcon } from "../../Icons/Icons";
import StatusDropdown from "../../ReusableComp/OrderDetails/StatusDropdown";
import {
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../../Redux/rtk/couponApi";
import { toast } from "react-hot-toast";

interface CouponDetailsModalProps {
  content: {
    couponId: string;
    code: string;
    description: string;
    discountAmount: number;
    validFrom: string;
    validUntil: string;
    minOrderAmount: number;
    validCategories: string[];
    status: string;
  };
  onClose: () => void;
}

const CouponDetailsModal: FC<CouponDetailsModalProps> = memo(
  ({ content, onClose }) => {
    const [status, setStatus] = useState<string>(content.status);
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

    const handleStatusChange = (newStatus: string) => {
      setStatus(newStatus);
    };

    useEffect(() => {
      if (status !== content.status) {
        setShowUpdateButton(true);
      } else {
        setShowUpdateButton(false);
      }
    }, [status, content.status]);

    const handleUpdateStatus = async () => {
      try {
        await updateCoupon({ id: content.couponId, data: { status } }).unwrap();
        toast.success("Coupon status updated successfully!");
        setShowUpdateButton(false);
      } catch (err) {
        toast.error("Failed to update coupon status. Please try again.");
      }
    };

    const handleDeleteCoupon = async () => {
      try {
        await deleteCoupon(content.couponId).unwrap();

        toast.success("Coupon deleted successfully!");
        onClose(); // Close the modal after deletion
      } catch (err) {
        toast.error("Failed to delete coupon. Please try again.");
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg md:w-3/4 md:h-3/4">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-3xl font-semibold font-ubuntu mb-4">
              Coupon Details
            </h2>
            <button onClick={onClose}>
              <CrossIcon />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex md:flex-row items-center gap-40">
              <p className="font-ubuntu text-lg">
                <strong>Coupon Code:</strong> {content.code}
              </p>
              <p className="font-ubuntu text-lg">
                <strong>Status:</strong>{" "}
                <StatusDropdown
                  currentStatus={status}
                  onStatusChange={handleStatusChange}
                  type="couponStatus"
                />
              </p>
              {showUpdateButton && (
                <button
                  onClick={handleUpdateStatus}
                  className="bg-black text-white px-4 py-2 rounded"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </button>
              )}
            </div>

            <p className="font-ubuntu text-lg">
              <strong>Description:</strong> {content.description}
            </p>

            <p className="font-ubuntu text-lg">
              <strong>Discount Amount:</strong> Rs. {content.discountAmount}
            </p>

            <p className="font-ubuntu text-lg">
              <strong>Valid From:</strong>{" "}
              {new Date(content.validFrom).toLocaleDateString()}
            </p>
            <p className="font-ubuntu text-lg">
              <strong>Valid Until:</strong>{" "}
              {new Date(content.validUntil).toLocaleDateString()}
            </p>

            <p className="font-ubuntu text-lg">
              <strong>Minimum Order Amount:</strong> Rs.{" "}
              {content.minOrderAmount}
            </p>

            <p className="font-ubuntu text-lg">
              <strong>Valid Categories:</strong>{" "}
              {Array.isArray(content.validCategories)
                ? content.validCategories.join(", ")
                : "N/A"}
            </p>
          </div>
          <div className="flex flex-row justify-end">
            <button
              onClick={handleDeleteCoupon}
              className="bg-red-600 text-white px-4 py-2 rounded"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Coupon"}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default CouponDetailsModal;

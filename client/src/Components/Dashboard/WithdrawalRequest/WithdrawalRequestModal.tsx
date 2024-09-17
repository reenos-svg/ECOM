import { FC, memo, useEffect, useState } from "react";
import { CrossIcon } from "../../Icons/Icons";
import StatusDropdown from "../../ReusableComp/OrderDetails/StatusDropdown";
import {
  useDeleteWithdrawalMutation,
  useUpdateWithdrawalMutation,
} from "../../../Redux/rtk/withdrawalApi";
import { toast } from "react-hot-toast";

interface WithdrawalRequest {
  id: string;
  vendorName: string;
  amount: number;
  closingBalance?: number;
  status: string;
  requestedDate: string;
}

interface WithdrawalRequestModalProps {
  content: WithdrawalRequest;
  onClose: () => void;
}

const WithdrawalRequestModal: FC<WithdrawalRequestModalProps> = memo(
  ({ content, onClose }) => {
    const [status, setStatus] = useState<string>(content.status);
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
    const [updateWithdrawalStatus, { isLoading: isUpdating }] =
      useUpdateWithdrawalMutation();
    const [deleteWithdrawalRequest, { isLoading: isDeleting }] =
      useDeleteWithdrawalMutation();

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
        await updateWithdrawalStatus({
          id: content.id,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          status: status,
        }).unwrap();
        toast.success("Withdrawal status updated successfully!");
        setShowUpdateButton(false);
      } catch (err) {
        toast.error("Failed to update withdrawal status. Please try again.");
      }
    };

    const handleDeleteRequest = async () => {
      try {
        await deleteWithdrawalRequest(content.id).unwrap();
        toast.success("Withdrawal request deleted successfully!");
        onClose(); // Close the modal after deletion
      } catch (err) {
        toast.error("Failed to delete withdrawal request. Please try again.");
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg ">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-3xl font-semibold font-ubuntu mb-4">
              Withdrawal Request Details
            </h2>
            <button onClick={onClose}>
              <CrossIcon />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-40">
              <p className="font-ubuntu text-lg">
                <strong>Vendor Name:</strong> {content.vendorName}
              </p>
              <p className="font-ubuntu text-lg">
                <strong>Status:</strong>{" "}
                <StatusDropdown
                  currentStatus={status}
                  onStatusChange={handleStatusChange}
                  type="withdrawalStatus"
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
              <strong>Amount:</strong> Rs. {content.amount}
            </p>
            <p className="font-ubuntu text-lg">
              <strong>Closing Balance:</strong>{" "}
              {content.closingBalance ?? "N/A"}
            </p>
            <p className="font-ubuntu text-lg">
              <strong>Requested Date:</strong> {content.requestedDate}
            </p>
          </div>
          <div className="flex flex-row justify-end">
            <button
              onClick={handleDeleteRequest}
              className="bg-red-600 text-white px-4 py-2 rounded"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Request"}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default WithdrawalRequestModal;

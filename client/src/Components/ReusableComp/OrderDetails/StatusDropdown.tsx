import { ChangeEvent, FC } from "react";

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  type?: string;
}

// component for status update
const StatusDropdown: FC<StatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  type,
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value);
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="ml-2 border-black border-2 px-4 py-2 rounded-xl text-sm md:text-base lg:text-lg"
    >
      {type === "couponStatus" ? (
        <>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </>
      ) : type === "withdrawalStatus" ? (
        <>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </>
      ) : (
        <>
          <option value="Order Placed">Order Placed</option>
          <option value="Order Confirm">Order Confirm</option>
          <option value="Processing">Processing</option>
          <option value="On the way">On the way</option>
          <option value="Delivered">Delivered</option>
        </>
      )}
    </select>
  );
};

export default StatusDropdown;

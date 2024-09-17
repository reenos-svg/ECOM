import { memo, useState } from "react";
import {
  LogoutIcon,
  OrdersIcon,
  PaymentsIcon,
  ProfileIcon,
  RefundsIcon,
  // UserAddressIcon,
} from "../Icons/Icons";
import { resetUser } from "../../Redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import ProfileOrderRefunds from "./ProfileOrderRefunds";
import PaymentMethod from "../PaymentMethodP/PaymentMethod";
import UserOrders from "./UserOrders";

const Profile = memo(() => {
  const [active, setActive] = useState<string>("Profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    setActive(item);
  };

  const handleLogout = () => {
    dispatch(resetUser());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-row items-center  md:items-start min-h-screen overflow-hidden">
      {/* Profile Sidebar */}
      <div className="md:w-1/4  py-6 ">
        <div className="flex bg-orange-100 rounded-xl mx-2 md:mx-4 md:p-6 p-3 min-h-screen  flex-col gap-4">
          <div
            className={`flex flex-row gap-4 items-center cursor-pointer ${
              active === "Profile" ? "text-orange-500" : ""
            }`}
            onClick={() => handleItemClick("Profile")}
          >
            <ProfileIcon active={active === "Profile"} />
            <span className="hidden md:block font-ubuntu font-medium text-lg">
              Profile
            </span>
          </div>
          <div
            className={`flex flex-row gap-4 items-center cursor-pointer ${
              active === "Orders" ? "text-orange-500" : ""
            }`}
            onClick={() => handleItemClick("Orders")}
          >
            <OrdersIcon active={active === "Orders"} />
            <span className="hidden md:block font-ubuntu font-medium text-lg">
              Orders
            </span>
          </div>
          <div
            className={`flex flex-row gap-4 items-center cursor-pointer ${
              active === "Payment Methods" ? "text-orange-500" : ""
            }`}
            onClick={() => handleItemClick("Payment Methods")}
          >
            <PaymentsIcon active={active === "Payment Methods"} />
            <span className="hidden md:block font-ubuntu font-medium text-lg">
              Payment Methods
            </span>
          </div>
          <div
            className={`flex flex-row gap-4 items-center cursor-pointer ${
              active === "Refunds" ? "text-orange-500" : ""
            }`}
            onClick={() => handleItemClick("Refunds")}
          >
            <RefundsIcon active={active === "Refunds"} />
            <span className="hidden md:block font-ubuntu font-medium text-lg">
              Refunds
            </span>
          </div>
          {/* <div
            className={`flex flex-row gap-4 items-center cursor-pointer ${
              active === "Address" ? "text-orange-500" : ""
            }`}
            onClick={() => handleItemClick("Address")}
          >
            <UserAddressIcon active={active === "Address"} />
            <span className="hidden md:block font-ubuntu font-medium text-lg">
              Address
            </span>
          </div> */}
          <div
            className={`flex flex-row gap-4 items-center cursor-pointer ${
              active === "Logout" ? "text-orange-500" : ""
            }`}
            onClick={handleLogout}
          >
            <LogoutIcon active={active === "Logout"} />
            <span className="hidden md:block font-ubuntu font-medium text-lg hover:text-orange-500">
              Logout
            </span>
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="md:w-3/4 w-full overflow-hidden md:p-4">
        {active === "Profile" && (
          <div>
            <ProfileDetails />
          </div>
        )}
        {active === "Orders" && (
          <div>
            <UserOrders />
          </div>
        )}
        {active === "Payment Methods" && (
          <div>
            <PaymentMethod />
          </div>
        )}
        {active === "Refunds" && (
          <div>
            <ProfileOrderRefunds />
          </div>
        )}
        {/* {active === "Address" && <div>Address Content</div>} */}
      </div>
    </div>
  );
});

export default Profile;

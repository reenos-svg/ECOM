import { memo } from "react";
import { BackIcon, ProfileIcon } from "../Icons/Icons";
import Button from "../ReusableComp/Button";
import { useNavigate } from "react-router-dom";
import { useGetVendorQuery } from "../../Redux/rtk/vendorApi";

const DashNav = memo(() => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetVendorQuery(""); // Call the API to fetch vendor details

  // Function to get the greeting based on the current time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const handleBackToShop = () => {
    navigate("/");
  };

  return (
    <div className=" h-20 bg-orange-100 flex flex-row items-center justify-between px-4">
      <div className="flex flex-row items-center gap-2">
        <Button
          btnIcon={<BackIcon />}
          btnType="normal"
          btnOnClick={handleBackToShop}
        />
        <h1 className="font-ubuntu text-xl sm:text-2xl font-medium">{`${getGreeting()}, ${
          data?.vendor.name || "Vendor"
        }`}</h1>
      </div>

      <div className="flex flex-row gap-3 cursor-pointer items-center border-2 bg-orange-50 rounded-xl px-3 sm:px-6 py-1">
        <span className="border-2 p-2 rounded-full">
          <ProfileIcon />
        </span>
        {isLoading ? (
          <p className="font-ubuntu text-sm sm:text-md">Loading....</p>
        ) : isError ? (
          <p className="font-ubuntu text-sm sm:text-md font-medium">Error loading data</p>
        ) : (
          <div className="flex flex-col">
            <h1 className="font-ubuntu text-sm sm:text-md font-medium">
              {data?.vendor?.name || "Vendor Name"}
            </h1>
            <h2 className="font-ubuntu text-xs sm:text-desc">
              <em>{data?.vendor?.email || "vendor@example.com"}</em>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
});

export default DashNav;

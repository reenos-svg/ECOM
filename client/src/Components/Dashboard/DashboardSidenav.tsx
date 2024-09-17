import { memo, useState } from "react";
import {
  CategoriesIcon,
  CategoryIcon,
  CreateProductIcon,
  DashboardIcon,
  DiscountIcon,
  DownIcon,
  LogoutIcon,
  NewspaperIcon,
  OrdersDashboardIcon,
  ProductsIcon,
  // RefundsIcon,
  SettingsIcon,
  SubcategoryIcon,
  WithdrawIcon,
  HamburgerIcon,
  HomepageIcon,
} from "../Icons/Icons";
import { resetUser } from "../../Redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateProduct from "./CreateProduct";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import GetProducts from "./GetProducts";
import GetOrders from "./GetOrders";
import Coupons from "./Coupons/Coupons";
import Withdraw from "./Withdraw";
import AllVendors from "./AllVendors";
import Category from "./Category";
import SubCategories from "./SubCategories";
import VendorOrders from "./VendorOrders";
import VendorSettings from "./VendorSetting";
import NewsLetter from "./NewsLetter";
import AllCoupons from "./AllCoupons";
import WithdrawalRequests from "./WithdrawalRequest/WithdrawlRequests";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import GetAllProducts from "./GetAllProducts";
import Homepage from "./Homepage";

const DashboardSidenav = memo(() => {
  const [active, setActive] = useState<string>("Dashboard");
  const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector(selectUserDetails);

  const handleItemClick = (item: string) => {
    setActive(item);
    setIsSidebarOpen(false); // Close sidebar on item click for mobile view
  };

  const handleLogout = () => {
    dispatch(resetUser());
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItemClass = "cursor-pointer font-ubuntu font-medium text-lg";

  return (
    <div className="flex min-h-screen gap-6 w-full">
      {/* Sidebar Toggle Button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 bg-orange-300 rounded-full p-4 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <HamburgerIcon />
      </button>

      {/* Profile Sidebar */}
      <div
        className={`fixed top-0 h-screen transition-transform duration-300 ease-in-out transform bg-orange-100  p-6 flex flex-col gap-4 ${
          isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"
        } md:translate-x-0 md:relative md:h-auto md:p-2 `}
      >
        <div className="flex flex-col gap-4 w-60">
          <div
            className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
            onClick={() => handleItemClick("Dashboard")}
          >
            <DashboardIcon active={active === "Dashboard"} />
            <span
              className={`${menuItemClass} ${
                active === "Dashboard" ? "text-orange-500" : ""
              }`}
            >
              Dashboard
            </span>
          </div>
          {role === "vendor" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("Products")}
            >
              <ProductsIcon active={active === "Products"} />
              <span
                className={`${menuItemClass} ${
                  active === "Products" ? "text-orange-500" : ""
                }`}
              >
                Products
              </span>
            </div>
          )}

          {role === "admin" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("AllProducts")}
            >
              <ProductsIcon active={active === "AllProducts"} />
              <span
                className={`${menuItemClass} ${
                  active === "AllProducts" ? "text-orange-500" : ""
                }`}
              >
                All Products
              </span>
            </div>
          )}
          {role === "admin" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("Orders")}
            >
              <OrdersDashboardIcon active={active === "Orders"} />
              <span
                className={`${menuItemClass} ${
                  active === "Orders" ? "text-orange-500" : ""
                }`}
              >
                All Orders
              </span>
            </div>
          )}
          {role === "vendor" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("VendorOrders")}
            >
              <OrdersDashboardIcon active={active === "VendorOrders"} />
              <span
                className={`${menuItemClass} ${
                  active === "VendorOrders" ? "text-orange-500" : ""
                }`}
              >
                Orders
              </span>
            </div>
          )}
          {/* Menu Button */}
          {role === "admin" && (
            <div
              className="flex flex-row justify-between items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform cursor-pointer"
              onClick={() => setIsMenuExpanded(!isMenuExpanded)}
            >
              <CategoriesIcon />
              <span className={`${menuItemClass}`}>Categories</span>
              <DownIcon
                transitionProperties={`transition-transform duration-300 ${
                  isMenuExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          )}
          {/* Sub-buttons */}
          {isMenuExpanded && (
            <div className="flex flex-col gap-2 pl-3">
              <div
                className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
                onClick={() => handleItemClick("Category")}
              >
                <CategoryIcon active={active === "Category"} />
                <span
                  className={`${menuItemClass} ${
                    active === "Category" ? "text-orange-500" : ""
                  }`}
                >
                  Category
                </span>
              </div>
              <div
                className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
                onClick={() => handleItemClick("Subcategory")}
              >
                <SubcategoryIcon active={active === "Subcategory"} />
                <span
                  className={`${menuItemClass} ${
                    active === "Subcategory" ? "text-orange-500" : ""
                  }`}
                >
                  Subcategory
                </span>
              </div>
            </div>
          )}
          <div
            className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
            onClick={() => handleItemClick("CreateProduct")}
          >
            <CreateProductIcon active={active === "CreateProduct"} />
            <span
              className={`${menuItemClass} ${
                active === "CreateProduct" ? "text-orange-500" : ""
              }`}
            >
              Create Product
            </span>
          </div>
          {role === "admin" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("NewsLetter")}
            >
              <NewspaperIcon active={active === "NewsLetter"} />
              <span
                className={`${menuItemClass} ${
                  active === "NewsLetter" ? "text-orange-500" : ""
                }`}
              >
                News Letter
              </span>
            </div>
          )}
          {role === "vendor" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("Withdraw")}
            >
              <WithdrawIcon active={active === "Withdraw"} />
              <span
                className={`${menuItemClass} ${
                  active === "Withdraw" ? "text-orange-500" : ""
                }`}
              >
                Withdraw
              </span>
            </div>
          )}
          {role === "admin" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("WithdrawalRequests")}
            >
              <WithdrawIcon active={active === "WithdrawalRequests"} />
              <span
                className={`${menuItemClass} ${
                  active === "WithdrawalRequests" ? "text-orange-500" : ""
                }`}
              >
                Withdrawal Requests
              </span>
            </div>
          )}
          {role === "admin" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("Homepage")}
            >
              <HomepageIcon active={active === "Homepage"} />
              <span
                className={`${menuItemClass} ${
                  active === "Homepage" ? "text-orange-500" : ""
                }`}
              >
                Homepage
              </span>
            </div>
          )}
          <div
            className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
            onClick={() => handleItemClick("Coupons")}
          >
            <DiscountIcon active={active === "Coupons"} />
            <span
              className={`${menuItemClass} ${
                active === "Coupons" ? "text-orange-500" : ""
              }`}
            >
              Coupons
            </span>
          </div>
          {role === "admin" && (
            <div
              className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
              onClick={() => handleItemClick("AllCoupons")}
            >
              <DiscountIcon active={active === "AllCoupons"} />
              <span
                className={`${menuItemClass} ${
                  active === "AllCoupons" ? "text-orange-500" : ""
                }`}
              >
                All Coupons
              </span>
            </div>
          )}
          <div
            className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
            onClick={() => handleItemClick("Settings")}
          >
            <SettingsIcon active={active === "Settings"} />
            <span
              className={`${menuItemClass} ${
                active === "Settings" ? "text-orange-500" : ""
              }`}
            >
              Settings
            </span>
          </div>
          <div
            className="flex flex-row gap-4 items-center hover:bg-orange-200 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out transform"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span className={`${menuItemClass}`}>Logout</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 md:w-3/4 w-full overflow-hidden md:p-4">
        {active === "Dashboard" && <DashboardOverview />}
        {active === "CreateProduct" && <CreateProduct />}
        {active === "Products" && <GetProducts />}
        {active === "Orders" && <GetOrders />}
        {active === "Coupons" && <Coupons />}
        {active === "Withdraw" && <Withdraw />}
        {active === "AllVendors" && <AllVendors />}
        {active === "Category" && <Category />}
        {active === "Subcategory" && <SubCategories />}
        {active === "VendorOrders" && <VendorOrders />}
        {active === "Settings" && <VendorSettings />}
        {active === "NewsLetter" && <NewsLetter />}
        {active === "AllCoupons" && <AllCoupons />}
        {active === "WithdrawalRequests" && <WithdrawalRequests />}
        {active === "AllProducts" && <GetAllProducts />}
        {active === "Homepage" && <Homepage />}
      </div>
    </div>
  );
});

export default DashboardSidenav;

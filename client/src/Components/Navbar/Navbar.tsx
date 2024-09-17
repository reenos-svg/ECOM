import { memo, useCallback, useEffect, useState } from "react";
import logo from "../Assets/Assets/logo.png";
import Button from "../ReusableComp/Button";
import {
  CartIcon,
  ProfileIcon,
  SearchIcon,
  WhishlistIcon,
  CrossIcon,
  HamburgerIcon, // Add the cross icon import
} from "../Icons/Icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectProductDetails } from "../../Redux/selector/SelectCartData";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import { resetUser } from "../../Redux/slice/authSlice";
import axios from "axios";
import { selectWishlist } from "../../Redux/slice/wishlistSlice";
import {
  ProductProps,
  useSearchProductsQuery,
} from "../../Redux/rtk/productApi";

const Navbar = memo(() => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showVendorMenu, setShowVendorMenu] = useState<boolean>(false);
  const [scrollNav, setScrollNav] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false); // State for search input visibility
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // State for search keyword
  const { data: searchResults, isLoading } = useSearchProductsQuery(
    searchKeyword,
    {
      skip: searchKeyword === "", // Skip the query if keyword is empty
    }
  );
  const dispatch = useDispatch();
  const { isLoggedIn, id, role } = useSelector(selectUserDetails);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrollNav(true);
      } else {
        setScrollNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleCartClick = () => {
    navigate("/cart");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleSearchClick = () => {
    setShowSearchInput((prev) => !prev); // Toggle search input visibility
    setShowMobileMenu(false);
  };

  const handleProfileClick = () => {
    setShowUserMenu((prev) => !prev);
    setShowMobileMenu(false);
  };

  const handleVendorZoneClick = () => {
    setShowVendorMenu((prev) => !prev);
  };

  const handleShopClick = () => {
    navigate("/");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleMenClick = () => {
    navigate("/men");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleWomenClick = () => {
    navigate("/women");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleThemesClick = () => {
    navigate("/themes");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleProductClick = useCallback(
    (productName: string, productId: string) => {
      const name = productName.replace(/ /g, "-");
      navigate(`/product/${name}/${productId}`);
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  const handleLogout = async () => {
    await axios.post("http://localhost:3000/api/v1/user/logout", null, {
      withCredentials: true,
    });

    setShowUserMenu(false);
    localStorage.removeItem("token");
    setShowMobileMenu(false);
    dispatch(resetUser());
  };

  const handleProfileDetails = () => {
    navigate("/user/profile");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleVendorClick = () => {
    navigate("/vendor/register");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleVendorLoginClick = () => {
    navigate("/vendor/login");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleDashboardClick = () => {
    navigate(`/vendor/dashboard/${id}`);
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setShowSearchInput(false);
    setShowUserMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  const cartItems = useSelector(selectProductDetails);
  const cartItemLength = cartItems.length;
  const wishlistItems = useSelector(selectWishlist);
  const wishlistItemLength = wishlistItems.length;

  return (
    <div className="relative">
      <div
        className={`z-50 flex max-w-screen h-20 items-center justify-between bg-orange-50 p-2 transition-all duration-500 ${
          scrollNav
            ? "transform translate-y-1 top-0 left-0 right-0 w-auto mx-[20px] md:mx-[180px] lg:mx-[90px] fixed rounded-full"
            : ""
        }`}
      >
        <div className="flex flex-row items-center gap-20">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <img src={logo} alt="logo-img" className="pl-6" />
          </div>

          <div className="relative md:hidden flex">
            <Button
              btnIcon={<HamburgerIcon />}
              btnOnClick={toggleMobileMenu}
              btnType="normal"
            />
            {showMobileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <ul className="flex flex-col gap-4 w-full p-4">
                  <li
                    className="font-ubuntu font-semibold text-xl cursor-pointer hover:underline"
                    onClick={handleShopClick}
                  >
                    Home
                  </li>
                  <li
                    className="font-ubuntu font-semibold text-xl cursor-pointer hover:underline"
                    onClick={handleMenClick}
                  >
                    Men
                  </li>
                  <li
                    className="font-ubuntu font-semibold text-xl cursor-pointer hover:underline"
                    onClick={handleWomenClick}
                  >
                    Women
                  </li>
                  <li
                    className="font-ubuntu font-semibold text-xl cursor-pointer hover:underline"
                    onClick={handleThemesClick}
                  >
                    Themes
                  </li>
                  <li className="relative flex items-center">
                    <Button
                      btnIcon={<WhishlistIcon />}
                      btnOnClick={handleWishlistClick}
                      btnType="normal"
                    />
                    <span className="w-5 top-0 left-8 md:right-1 md:left-0 absolute h-5 text-center text-sm bg-red-600 font-ubuntu rounded-full text-white">
                      {wishlistItemLength}
                    </span>
                  </li>
                  <li className="relative flex items-center">
                    <Button
                      btnIcon={<CartIcon />}
                      btnOnClick={handleCartClick}
                      btnType="normal"
                    />
                    <span className="w-5 top-0 left-8 md:right-1 md:left-0  absolute h-5 text-center text-sm bg-red-600 font-ubuntu rounded-full text-white">
                      {cartItemLength}
                    </span>
                  </li>
                  {isLoggedIn ? (
                    <>
                      <li className="relative flex items-center">
                        <Button
                          btnIcon={<ProfileIcon />}
                          btnOnClick={handleProfileClick}
                          btnType="normal"
                        />
                        {showUserMenu && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg">
                            {role !== "vendor" && role !== "admin" && (
                              <>
                                <div
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={handleLogout}
                                >
                                  Logout
                                </div>
                                <div
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={handleProfileDetails}
                                >
                                  Profile
                                </div>
                              </>
                            )}
                            {(role === "vendor" || role === "admin") && (
                              <div
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={handleDashboardClick}
                              >
                                Dashboard
                              </div>
                            )}
                            {/* Add other user options here */}
                          </div>
                        )}
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="font-ubuntu font-semibold text-xl cursor-pointer hover:underline">
                        <Button
                          btnContent="Login"
                          btnOnClick={handleLoginClick}
                          btnType="normal"
                        />
                      </li>

                      <li className="font-ubuntu font-semibold text-xl cursor-pointer hover:underline">
                        <Button
                          btnContent="Become a Vendor"
                          btnOnClick={handleVendorClick}
                          btnType="normal"
                        />
                      </li>
                      <li className="font-ubuntu font-semibold text-xl cursor-pointer hover:underline">
                        <Button
                          btnContent="Vendor Login"
                          btnOnClick={handleVendorLoginClick}
                          btnType="normal"
                        />
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className=" hidden md:flex flex-row items-center">
          <div className="flex flex-row gap-14 mr-20">
            <span
              className="font-ubuntu font-semibold text-2xl cursor-pointer hover:underline"
              onClick={handleShopClick}
            >
              Home
            </span>
            <span
              className="font-ubuntu font-semibold text-2xl cursor-pointer hover:underline"
              onClick={handleMenClick}
            >
              Men
            </span>
            <span
              className="font-ubuntu font-semibold text-2xl cursor-pointer hover:underline"
              onClick={handleWomenClick}
            >
              Women
            </span>
            <span
              className="font-ubuntu font-semibold text-2xl cursor-pointer hover:underline"
              onClick={handleThemesClick}
            >
              Themes
            </span>
          </div>

          <div className="relative">
            {showSearchInput ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="font-ubuntu px-2 py-1 w-52 border rounded-md"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)} // Update search keyword
                  onBlur={() => setShowSearchInput(false)} // Hide input when it loses focus
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={handleClearSearch}
                >
                  <CrossIcon /> {/* Add the cross icon */}
                </button>
                {searchKeyword && searchResults && (
                  <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto">
                    <ul>
                      {isLoading && <li className="px-4 py-2">Loading...</li>}
                      {searchResults.products.length ? (
                        searchResults.products.map((product: ProductProps) => (
                          <li
                            key={product._id}
                            className="px-4 py-2 font-ubuntu hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                              handleProductClick(
                                product.productName,
                                product._id
                              )
                            }
                          >
                            {product.productName}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2">No products found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Button
                btnIcon={<SearchIcon />}
                btnType="normal"
                btnOnClick={handleSearchClick}
              />
            )}
          </div>

          <div className="relative">
            <Button
              btnIcon={<WhishlistIcon />}
              btnOnClick={handleWishlistClick}
              btnType="normal"
            />
            <span className="w-5 top-0 right-2 absolute h-5 text-center text-sm bg-red-600 font-ubuntu rounded-full text-white">
              {wishlistItemLength}
            </span>
          </div>

          <div className="relative">
            <Button
              btnIcon={<CartIcon />}
              btnOnClick={handleCartClick}
              btnType="normal"
            />
            <span className="w-5 top-0 right-1 absolute h-5 text-center text-sm bg-red-600 font-ubuntu rounded-full text-white">
              {cartItemLength}
            </span>
          </div>

          <div className="relative">
            {isLoggedIn ? (
              <>
                <Button
                  btnIcon={<ProfileIcon />}
                  btnOnClick={handleProfileClick}
                  btnType="normal"
                />
                {showUserMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg">
                    {role !== "vendor" && role !== "admin" && (
                      <>
                        <div
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          Logout
                        </div>
                        <div
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={handleProfileDetails}
                        >
                          Profile
                        </div>
                      </>
                    )}
                    {(role === "vendor" || role === "admin") && (
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={handleDashboardClick}
                      >
                        Dashboard
                      </div>
                    )}
                    {/* Add other user options here */}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-row gap-5 mx-4 items-center">
                <Button btnContent="Login" btnOnClick={handleLoginClick} />
                <div className="relative">
                  <Button
                    btnContent="Vendor Zone"
                    btnOnClick={handleVendorZoneClick}
                  />
                  {showVendorMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg">
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={handleVendorClick}
                      >
                        Become a Vendor
                      </div>
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={handleVendorLoginClick}
                      >
                        Vendor Login
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Navbar;

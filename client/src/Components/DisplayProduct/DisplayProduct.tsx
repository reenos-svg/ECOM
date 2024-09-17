import { FC, memo, useState } from "react";
import TabNavigation from "../ReusableComp/TabNavigation";
import Button from "../ReusableComp/Button";
import CustomModal from "../ReusableComp/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/slice/cartSlice";
import toast from "react-hot-toast";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import { ProductProps } from "../../Redux/rtk/productApi";
import Carousel from "./Carousel";
import { NoIcon } from "../Icons/Icons";
import ProductReviews from "./ProductReviews";
import { useFetchSizeChartImagesQuery } from "../../Redux/rtk/homepageApi";

interface DisplayProductProps {
  product: ProductProps;
}

const DisplayProduct: FC<DisplayProductProps> = memo(({ product }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [colorImage, setColorImage] = useState<string | null>(null); // Added state for color image
  const { isLoggedIn } = useSelector(selectUserDetails);
  const { data } = useFetchSizeChartImagesQuery();
  // Check if data exists and filter images with status 'true'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const activeImage = data?.filter((img) => img.status === true);
  console.log(activeImage[0].url);

  const tabs = [
    {
      id: 1,
      label: "Description",
      data: product.productDescription,
    },
    {
      id: 2,
      label: "Reviews",
      component: (
        <ProductReviews productId={product._id} reviews={product.reviews} />
      ),
    },
    {
      id: 3,
      label: "Return Policy",
      data: "4 days Return & Exchange Return Reason Return Period Return Policy Any other reason 4 days from delivery Full refund Size too small, Size too large 4 days from delivery Exchange with a different size or colour",
    },
  ];

  // Handle reset color
  const handleResetColor = () => {
    setSelectedColor(null);
    setColorImage(null);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        productName: product.productName,
        productCategory: product.productCategory.name,
        productPrice: product.discountedProductPrice,
        productImage: colorImage || product.productImages[0], // Use colorImage if available
        productQuantity: 1,
        productSize: selectedSize,
        productColor: selectedColor,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        productVendor: product.vendorId,
      })
    );
    toast.success(`${product.productName} added to cart`, {
      style: {
        border: "1px solid ",
        font: "ubuntu",
      },
    });
  };

  const handleBuyClick = () => {
    console.log("click");
  };

  const handleSizeChartClick = () => {
    setIsModalOpen(true);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorClick = (colorName: string, colorImage?: string) => {
    setSelectedColor(colorName);
    setColorImage(colorImage || null); // Set the color image based on the selected color
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const calculateDiscountPercentage = (
    basePrice: number,
    discountedPrice: number
  ): number => {
    return Math.round(((basePrice - discountedPrice) / basePrice) * 100);
  };

  // Calculate discount percentage
  const discountPercentage = calculateDiscountPercentage(
    product.productPrice,
    product.discountedProductPrice
  );

  return (
    <div className="h-full mt-10 md:mb-20 mb-10 flex md:flex-row gap-36 flex-col p-10">
      {/* images */}
      <div className="flex flex-row gap-2 md:h-3/5 md:w-1/2">
        <Carousel images={colorImage ? [colorImage] : product.productImages} />
      </div>
      {/* product details */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-5 items-center">
          {product?.productTheme && (
            <span className=" font-ubuntu border-2 w-40 bg-orange-100 border-orange-100 text-orange-500 font-semibold text-center rounded-3xl">
              {product?.productTheme} Theme
            </span>
          )}
          {product?.isFeatured ? (
            <span className=" font-ubuntu border-2 w-40 bg-orange-100 border-orange-100 text-orange-500 font-semibold text-center rounded-3xl">
              {product?.isFeatured && "Featured"}
            </span>
          ) : null}
        </div>
        <span className="font-semibold font-ubuntu text-3xl w-3/5">
          {product.productName}
        </span>
        <span className="font-semibold font-ubuntu text-lg text-gray-500">
          {product.productCategory.name}
        </span>
        <span className="font-semibold font-ubuntu text-lg text-gray-500">
          {product.reviews.length} Reviews
        </span>
        {/* product Price */}
        <div className="flex justify-between mt-4 flex-col">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              Rs. {product.discountedProductPrice}
            </h1>
            <p className="ml-4 px-2 py-1 font-bold text-orange-500 rounded-lg bg-[#FAD8A0]">
              {discountPercentage}%
            </p>
          </div>
          <p className="text-[#b1b8be] line-through text-xl">
            Rs. {product.productPrice}
          </p>
        </div>

        {/* add a size chart modal */}
        <div className="flex flex-row gap-6 items-center">
          <span className="font-semibold font-ubuntu text-lg">Size Chart:</span>
          <Button
            btnType="size"
            btnContent="View Size Chart"
            btnOnClick={handleSizeChartClick}
          />
          <CustomModal isOpen={isModalOpen} onClose={closeModal}>
            <img src={activeImage[0]?.url} alt={activeImage[0]?.title} className="w-96 h-auto" />
          </CustomModal>
        </div>

        {/* Select Size */}
        <div className="flex flex-col gap-2">
          <span className="font-ubuntu font-semibold text-lg">
            Select Size:
          </span>
          <div className="flex flex-row gap-4">
            {product.productSize.map((size) => (
              <Button
                key={size}
                btnContent={size}
                btnType="size"
                btnOnClick={() => handleSizeClick(size)}
                selected={selectedSize === size} // Pass selected prop
              />
            ))}
          </div>
        </div>

        {/* Select Color */}
        <div className="flex flex-col gap-2">
          <span className="font-ubuntu font-semibold text-lg">
            Select Color:
          </span>
          <div className="flex flex-row gap-4">
            {product.productColors.map((color) => (
              <div key={color.colorName} className="flex flex-col items-center">
                <button
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    handleColorClick(color.colorName, color.imageUrl)
                  }
                  className={`w-12 h-12 rounded-full ${
                    selectedColor === color.colorName
                      ? "border-4 border-black"
                      : ""
                  }`}
                  style={{ backgroundColor: color.colorCode }}
                ></button>
                <div className="text-sm mt-1">{color.colorName}</div>
              </div>
            ))}

            <Button
              btnOnClick={handleResetColor}
              btnIcon={<NoIcon />}
              btnType="noColor"
            />
            {/* <button
              onClick={handleResetColor}
              className=""
            >
              Reset Color
            </button> */}
          </div>
        </div>

        {/* Shipping and Seller Info */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-6 items-center">
            <span className="font-semibold font-ubuntu text-lg">
              Shipping Time:
            </span>
            <span className="font-semibold font-ubuntu text-lg">5-7 days</span>
          </div>
          <div className="flex flex-row gap-6 items-center">
            <span className="font-semibold font-ubuntu text-lg">
              Shipping Charge:
            </span>
            <span className="font-semibold font-ubuntu text-lg">
              Free Shipping
            </span>
          </div>
          <div className="flex flex-row gap-6 items-center">
            <span className="font-semibold font-ubuntu text-lg">Seller:</span>
            <span className="font-semibold font-ubuntu text-lg">
              {product?.vendorId?.name || "aarem"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-6 items-center mt-4">
          {isLoggedIn ? (
            <Button
              btnContent="Add to Cart"
              btnType="shop"
              btnOnClick={handleAddToCart}
            />
          ) : null}
          <Button
            btnContent="Buy Now"
            btnType="shop"
            btnOnClick={handleBuyClick}
          />
        </div>
        <div className="mt-10 ">
          <TabNavigation tabs={tabs} />
        </div>
      </div>
    </div>
  );
});

export default DisplayProduct;

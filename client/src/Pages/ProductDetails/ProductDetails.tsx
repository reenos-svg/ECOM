import { useNavigate, useParams } from "react-router-dom";
import {
  ProductProps,
  useDeleteProductMutation,
  useFetchAllProductsQuery,
} from "../../Redux/rtk/productApi";
import { FC, useState } from "react";
import { BackIcon, ProductsIcon } from "../../Components/Icons/Icons";
import Carousel from "../../Components/DisplayProduct/Carousel";
import Button from "../../Components/ReusableComp/Button";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import { PiUserCircle } from "react-icons/pi";
import StarRating from "../../Components/DisplayProduct/StarRating";

type color = {
  _id: string;
  imageUrl: string;
  colorName: string;
  colorCode: string;
};

type review = {
  userId: {
    name: string;
  };
  rating: number;
  comment: string;
  _id: string;
};
const ProductDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useFetchAllProductsQuery({});
  const { user } = useSelector(selectUserDetails);

  // State to handle the delete modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  // Assuming the API response is an object with a "products" field
  const products = data?.products || [];
  const product = products.find((e: ProductProps) => e._id === id);
  const [deleteProduct] = useDeleteProductMutation();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{isError}</div>;
  if (!product) return <div>No product found</div>;

  const fieldData = [
    { label: "Product Id", value: product._id },
    { label: "Product Name", value: product.productName },
    {
      label: "Product Category",
      value: product.productCategory?.name,
    },
    {
      label: "Product Sub-category",
      value: product.productSubCategory?.name,
    },
    {
      label: "Product Description",
      value: product.productDescription,
    },
    { label: "Product Price", value: product.productPrice },
    {
      label: "Product Discounted Price",
      value: product.discountedProductPrice,
    },
    {
      label: "Product Available Stock",
      value: product.productStock,
    },
    {
      label: "Product Size",
      value: product.productSize.join(", "),
    },
  ];

  const handleBackToDash = () => {
    navigate("/vendor/dashboard");
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteProduct({
        productId: product._id,
        vendorId: user?.vendorId,
      }).unwrap();

      toast.success(`Product deleted: ${response.message}`, {
        position: "top-right",
        duration: 3000,
      });
      navigate("/vendor/dashboard");
    } catch (error) {
      toast.error(`Failed to delete the product`, {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleDeleteProduct = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const handleEditProduct = () => {
  //   console.log("click");
  // };

  return (
    <div className="flex flex-col">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-orange-100 p-6 rounded-lg text-center">
            <h2 className="text-lg font-ubuntu mb-4">
              Are you sure you want to delete the Product?
            </h2>
            <div className="flex items-center justify-center gap-4">
              <Button
                btnOnClick={handleDeleteConfirm}
                btnContent="Yes, delete it"
              />
              <Button btnOnClick={closeModal} btnContent="Cancel" />
            </div>
          </div>
        </div>
      )}
      <div className="bg-orange-100 flex flex-col md:flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button
            btnIcon={<BackIcon />}
            btnType="normal"
            btnOnClick={handleBackToDash}
          />
          <div className="flex items-center gap-4">
            <ProductsIcon />
            <span className="text-xl w-full font-ubuntu font-semibold">
              Detail Product
            </span>
            <span className="text-xl font-ubuntu truncate w-20 md:w-full font-semibold">
              {product._id}
            </span>
          </div>
        </div>
        <Button btnContent="Delete Product" btnOnClick={handleDeleteProduct} />
      </div>
      <div className="p-4 md:p-10">
        {/* Product Header */}
        {/* <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <Button btnContent="Edit Product" btnOnClick={handleEditProduct} />
        </div> */}

        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 space-y-4 flex flex-col gap-2">
            <div className="flex flex-col gap-4 bg-orange-50 rounded-3xl p-4 md:p-8">
              {fieldData.map(({ label, value }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  {label === "Product Description" ? (
                    <div className="flex flex-col gap-4">
                      <span className="text-lg font-ubuntu font-medium text-desc">
                        {label}
                      </span>
                      <pre className="text-lg font-ubuntu font-medium">
                        {value}
                      </pre>
                    </div>
                  ) : (
                    <>
                      <span className="text-lg font-ubuntu font-medium text-desc">
                        {label}
                      </span>
                      <span className="text-lg font-ubuntu font-medium">
                        {value}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
            {product.productTheme && (
              <div className="flex flex-col gap-4 bg-orange-50 rounded-3xl p-4 md:p-8">
                <div className="flex flex-row justify-between">
                  <h1 className="text-lg font-ubuntu font-medium text-desc">
                    Theme
                  </h1>
                  <span className="text-lg font-ubuntu font-medium">
                    {product.productTheme}
                  </span>
                </div>
              </div>
            )}
            {product.reviews > 1 && (
              <div className="flex flex-col gap-4 bg-orange-50 rounded-3xl p-4 md:p-8">
                <h1 className="text-lg font-ubuntu font-medium">
                  Product Reviews
                </h1>

                {product.reviews.map((review: review) => (
                  <div
                    key={review._id}
                    className="my-4 flex flex-col p-4 border rounded-md shadow-sm"
                  >
                    <div className="flex flex-row gap-4 items-center mb-2">
                      <PiUserCircle size={"2.8rem"} />
                      <span className="font-ubuntu text-xl">
                        {review.userId.name}
                      </span>
                    </div>
                    <StarRating rating={review.rating} readOnly />
                    <p className="mt-2 font-ubuntu text-lg text-desc">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="bg-orange-50 rounded-3xl p-4 md:p-8 h-full">
              <Carousel images={product.productImages} />
            </div>
            {product.productColors > 1 && (
              <div className="bg-orange-50 rounded-3xl p-4 md:p-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-lg font-ubuntu font-medium text-desc">
                    Product Color Variants
                  </span>
                  <span className="text-lg font-ubuntu font-medium">
                    {product._id}
                  </span>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                  {product.productColors.map((color: color) => (
                    <div
                      key={color._id}
                      className="flex flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all w-full md:w-1/2 lg:w-1/3"
                    >
                      <div className="flex flex-row gap-4 items-center">
                        <img
                          src={color.imageUrl}
                          alt={color.colorName}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex flex-col">
                          <span
                            className="text-md font-ubuntu font-medium"
                            style={{ color: color.colorCode }}
                          >
                            {color.colorName}
                          </span>
                          <span className="text-sm font-ubuntu text-gray-600">
                            {color.colorCode}
                          </span>
                        </div>
                      </div>
                      <div
                        className="h-10 w-10 rounded-full"
                        style={{ backgroundColor: color.colorCode }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

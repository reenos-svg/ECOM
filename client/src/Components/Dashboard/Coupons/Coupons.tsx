import { memo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import RenderHeader from "../../ReusableComp/RenderHeading";
import Button from "../../ReusableComp/Button";
import CustomModal from "../../ReusableComp/CustomModal";
import {
  useCreateCouponMutation,
  useGetCouponsByVendorIdQuery,
} from "../../../Redux/rtk/couponApi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUserDetails } from "../../../Redux/selector/SelectAuthData";
import { TableHeadingItem } from "../../ReusableComp/TablePropsType";
import Loader from "../../ReusableComp/Loader";
import SearchAbleTable from "../../ReusableComp/SearchAbleTable";


// Define the initial values for the Formik form
const initialValues = {
  code: "",
  description: "",
  discountAmount: "",
  validFrom: "",
  validUntil: "",
  minOrderAmount: "",
  validCategories: "",
};

// Define validation schema using Yup
const validationSchema = Yup.object({
  code: Yup.string()
    .required("Coupon Code is required")
    .min(3, "Coupon Code must be at least 3 characters long"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long"),
  discountAmount: Yup.number()
    .required("Discount Amount is required")
    .positive("Discount Amount must be positive")
    .integer("Discount Amount must be an integer"),
  validFrom: Yup.date().required("Valid From date is required"),
  validUntil: Yup.date().required("Valid Until date is required"),
  minOrderAmount: Yup.string().required("Minimum Order Amount is required"),
  validCategories: Yup.string().required("Valid Categories are required"),
});

const Coupons = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const { id } = useSelector(selectUserDetails);
  const vendorId = id;

  const {
    data,
    isLoading: couponsLoading,
    isError: couponsError,
    refetch,
  } = useGetCouponsByVendorIdQuery(vendorId || "");

  // Define table headings
  const tableHeading: TableHeadingItem[] = [
    { label: "Coupon Code" },
    { label: "Description" },
    { label: "Discount Amount" },
    { label: "Valid From" },
    { label: "Valid Until" },
    { label: "Minimum Order Amount" },
    { label: "Valid Categories" },
  ] as const;

  
  // Transform the API data to match the expected format
  const tableData =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
    data?.coupons?.map((coupon) => ({
      couponId: coupon._id,
      code: coupon.code,
      description: coupon.description,
      discountAmount: coupon.discountAmount,
      validFrom: new Date(coupon.validFrom).toLocaleDateString(), // Formatting the date
      validUntil: new Date(coupon.validUntil).toLocaleDateString(), // Formatting the date
      minOrderAmount: coupon.minOrderAmount,
      validCategories: coupon.validCategories.join(", "), // Join array of categories into a string
    })) ;

  if (couponsLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (couponsError) {
    return <div>Error loading coupons</div>;
  }

  // Handle opening the modal
  const handleAddCoupons = () => {
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await createCoupon({
        ...values,
        discountAmount: Number(values.discountAmount),
        minOrderAmount: Number(values.minOrderAmount),
        validFrom: new Date(values.validFrom).toISOString(), // Ensure date is formatted correctly
        validUntil: new Date(values.validUntil).toISOString(), // Ensure date is formatted correctly
        validCategories: values.validCategories
          .split(",")
          .map((category) => category.trim()),
      }).unwrap();
      toast.success("Coupon created successfully!");
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to create coupon");
      console.error("Failed to create coupon:", err);
    }
  };

  // Close the modal
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <RenderHeader
        subHeading="Coupons"
        buttonComponent={
          <Button btnContent="Add Coupons" btnOnClick={handleAddCoupons} />
        }
      />
      {isModalOpen && (
        <CustomModal onClose={handleClose} isOpen={isModalOpen}>
          <h2 className="font-ubuntu text-xl font-semibold mb-4">
            Create New Coupon
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="md:w-96 p-4 flex flex-col gap-4 h-96 overflow-scroll">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Coupon Code
                  </label>
                  <Field
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Enter Coupon Code"
                    className="border-2 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="code"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Field
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Enter Description"
                    className="border-2 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Amount
                  </label>
                  <Field
                    id="discountAmount"
                    name="discountAmount"
                    type="number"
                    placeholder="Enter Discount Amount"
                    className="border-2 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="discountAmount"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="validFrom"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Valid From
                  </label>
                  <Field
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    placeholder="Enter Valid From Date"
                    className="border-2 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="validFrom"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="validUntil"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Valid Until
                  </label>
                  <Field
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    placeholder="Enter Valid Until Date"
                    className="border-2 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="validUntil"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="minOrderAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Order Amount
                  </label>
                  <Field
                    id="minOrderAmount"
                    name="minOrderAmount"
                    type="number"
                    placeholder="Enter Minimum Order Amount"
                    className="border-2 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="minOrderAmount"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="validCategories"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Valid Categories
                  </label>
                  <Field
                    id="validCategories"
                    name="validCategories"
                    type="text"
                    placeholder="Enter Valid Categories"
                    className="border-2 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="validCategories"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-300 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Coupon"}
                </button>
              </Form>
            )}
          </Formik>
        </CustomModal>
      )}

      {/* Display table */}
      <div className="flex flex-col">
        <SearchAbleTable
          tableData={tableData}
          tableHeading={tableHeading}
          tableType="couponTable"
          categoryDropDownPlaceHolder="Select a Category"
          searchInputPlaceHolder="Search for Coupons"
          messageText="No data available"
          isLoading={false}
        />
      </div>
    </div>
  );
});

export default Coupons;

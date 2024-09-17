import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { getInitials } from "../../utils/GetInitials";
import {
  useDeleteVendorMutation,
  useGetVendorQuery,
  useUpdateVendorMutation,
} from "../../Redux/rtk/vendorApi";
import Button from "../ReusableComp/Button";
import RenderHeader from "../ReusableComp/RenderHeading";
import { useState } from "react";
import CustomModal from "../ReusableComp/CustomModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUser } from "../../Redux/slice/authSlice";

const VendorSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: vendorDetails, error, isLoading } = useGetVendorQuery("");
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error Loading the Profile Data</div>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const name = getInitials(vendorDetails?.vendor.name);

  const handleDeleteAccount = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteVendor(vendorDetails?.vendor._id).unwrap();
      toast.success("Account deleted successfully");
      if (response) {
        dispatch(resetUser());
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (err) {
      toast.error("Failed to delete account");
      console.error("Failed to delete account:", err);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pt-4 h-auto bg-orange-100 rounded-lg items-center">
      <div className="flex flex-col md:flex-row gap-4 p-4  items-center">
        <RenderHeader
          subHeading="Delete Account"
          description="When you delete your account you loose access to  Front account and services and we permanantly delete your personal data."
        />
        <Button btnContent="Delete Account" btnOnClick={handleDeleteAccount} />
      </div>
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-ubuntu font-semibold mb-4">
          Confirm Delete
        </h2>
        <p className="mb-4 font-ubuntu text-desc">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            btnOnClick={() => setIsModalOpen(false)}
            btnContent="Cancel"
          />
          <Button btnOnClick={handleConfirmDelete} btnContent="Delete" />
        </div>
      </CustomModal>
      <div className="border-2 rounded-full p-8 h-28 w-28 text-center bg-slate-300">
        <span className="text-4xl font-ubuntu text-center font-semibold">
          {name}
        </span>
      </div>
      <Formik
        initialValues={{
          name: vendorDetails?.vendor.name || "",
          email: vendorDetails?.vendor.email || "",
          phone: vendorDetails?.vendor.phoneNumber || "",
          address: vendorDetails?.vendor.address || "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await updateVendor(values).unwrap();
            toast.success("Profile updated successfully");
          } catch (err) {
            toast.error("Failed to update profile");
            console.error("Failed to update profile:", err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex flex-col gap-4 md:h-96 w-full p-6">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Name</label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className={`border-2 p-2 rounded-lg ${
                    touched.name && errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email">Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`border-2 p-2 rounded-lg ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone">Phone</label>
                <Field
                  name="phoneNumber"
                  type="text"
                  placeholder="Enter your phone number"
                  className={`border-2 p-2 rounded-lg ${
                    touched.phone && errors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="address">Address</label>
                <Field
                  name="address"
                  type="text"
                  placeholder="Enter your address"
                  className={`border-2 p-2 rounded-lg ${
                    touched.address && errors.address
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-orange-500 w-60 text-white p-2 rounded-lg hover:bg-orange-600"
              disabled={isSubmitting || isUpdating}
            >
              {isSubmitting || isUpdating ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VendorSettings;

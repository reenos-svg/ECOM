/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import { BulbIcon } from "../Icons/Icons";
import Button from "../ReusableComp/Button";
import CustomModal from "../ReusableComp/CustomModal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  useCreateWithdrawalMutation,
  useGetWithdrawalsByVendorQuery,
} from "../../Redux/rtk/withdrawalApi";
import Loader from "../ReusableComp/Loader";
import SearchAbleTable from "../ReusableComp/SearchAbleTable";
import RenderHeader from "../ReusableComp/RenderHeading";

// Define interfaces for withdrawal data
interface Withdrawal {
  _id: string;
  vendor: string;
  amount: string;
  date: string;
  branchName: string;
  address: string;
  phoneNumber: string;
  status: string;
  closingBalance: string;
}

interface WithdrawProps {
  accountHolderName: string;
  accountNumber: string;
  branchName: string;
  address: string;
  phoneNumber: string;
  amount: number;
}

const Withdraw = () => {
  const [showModal, setShowModal] = useState(false);
  const [createWithdrawal] = useCreateWithdrawalMutation();

  const { data, isLoading } = useGetWithdrawalsByVendorQuery();

  // Define table headings
  const tableHeading = [
    { label: "Id" },
    { label: "Vendor Name" },
    { label: "Amount" },
    { label: "Closing Balance" },
    { label: "Status" },
    { label: "Requested Date" },
  ] as const; // Adding 'as const' for immutability

  // Transform the API data to match the expected format
  const tableData =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data?.map((item: Withdrawal) => ({
      id: item._id,
      // @ts-expect-error
      vendorName: item.vendor.name,
      amount: item.amount,
      closingBalance: item.closingBalance, // Adjust this if closing balance data is available
      status: item.status,
      requestedDate: item.date, // Format the date
    })) || [];

  // Show loader if data is being fetched
  if (isLoading) {
    return <Loader />;
  }

  // Modal toggle handlers
  const handleWithdrawlClick = () => setShowModal(!showModal);
  const handleCloseModal = () => setShowModal(false);

  // Initial values for Formik
  const initialValues: WithdrawProps = {
    accountHolderName: "",
    accountNumber: "",
    branchName: "",
    address: "",
    phoneNumber: "",
    amount: 0,
  };

  // Validation schema for Formik
  const validationSchema = Yup.object({
    accountHolderName: Yup.string().required(
      "Account Holder's Name is Required"
    ),
    accountNumber: Yup.string().required("Account Number is Required"),
    branchName: Yup.string().required("Branch Name is Required"),
    address: Yup.string().required("Branch Address is Required"),
    phoneNumber: Yup.string().required("Phone Number is Required"),
    amount: Yup.number()
      .required("Amount is Required")
      .positive("Amount must be greater than zero"),
  });

  // Submit handler for Formik
  const handleSubmit = async (values: WithdrawProps) => {
    try {
      await createWithdrawal(values).unwrap();
      toast.success("Withdrawal successful!");
    } catch (error) {
      toast.error("Failed to create withdrawal");
    }
    handleCloseModal();
  };

  // Transform unique categories into an object
  const categoriesObject = () => {
    // Using reduce to accumulate unique categories into an object
    const categoriesObj = tableData.reduce<{ [key: string]: string }>(
      (acc, item) => {
        acc[item.status] = item.status; // Adjust based on actual category logic
        return acc;
      },
      { All: "All" }
    );
    return categoriesObj;
  };

  return (
    <>
      <div className="flex flex-col gap-10 ">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-orange-100 w-4/5 p-4 rounded-xl flex flex-row gap-4 justify-center items-center">
            <BulbIcon />
            <p className="font-ubuntu text-lg text-orange-500">
              Enjoy a complimentary 6-month period on our platform. After this
              introductory phase, a 10% commission fee will be applied to each
              order you receive.
            </p>
          </div>
        </div>
        <RenderHeader
          subHeading="Withdraw"
          buttonComponent={
            <Button
              btnContent="New Withdrawal"
              btnOnClick={handleWithdrawlClick}
            />
          }
        />
        <div className="flex flex-col">
          <SearchAbleTable
            tableData={tableData}
            // @ts-expect-error
            tableHeading={tableHeading}
            tableType="withdrawalsTable" // Adjust the table type as needed
            categoryDropDownPlaceHolder="Select a Status"
            searchInputPlaceHolder="Search for Withdrawals"
            messageText="No data available"
            categoryDropDownData={categoriesObject()}
            isLoading={false} // Update this based on actual loading state if needed
          />
        </div>
        {showModal && (
          <CustomModal isOpen={showModal} onClose={handleCloseModal}>
            <div className="md:w-[30rem]">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col">
                      <label
                        className="font-ubuntu"
                        htmlFor="accountHolderName"
                      >
                        Account Holder Name
                      </label>
                      <Field
                        type="text"
                        name="accountHolderName"
                        className="border rounded p-2"
                      />
                      <ErrorMessage
                        name="accountHolderName"
                        component="div"
                        className="text-xs text-red-500"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="flex flex-col">
                        <label className="font-ubuntu" htmlFor="accountNumber">
                          Account Number
                        </label>
                        <Field
                          type="text"
                          name="accountNumber"
                          className="border rounded p-2"
                        />
                        <ErrorMessage
                          name="accountNumber"
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-ubuntu" htmlFor="branchName">
                          Branch Name
                        </label>
                        <Field
                          type="text"
                          name="branchName"
                          className="border rounded p-2"
                        />
                        <ErrorMessage
                          name="branchName"
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="font-ubuntu" htmlFor="address">
                        Address
                      </label>
                      <Field
                        type="text"
                        name="address"
                        className="border rounded p-2"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-xs text-red-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-ubuntu" htmlFor="phoneNumber">
                        Phone Number
                      </label>
                      <Field
                        type="text"
                        name="phoneNumber"
                        className="border rounded p-2"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-xs text-red-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-ubuntu" htmlFor="amount">
                        Amount
                      </label>
                      <Field
                        type="number"
                        name="amount"
                        className="border rounded p-2"
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="text-xs text-red-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black font-ubuntu px-4 py-2 rounded-lg text-white mt-4"
                    >
                      Submit
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </CustomModal>
        )}
      </div>
    </>
  );
};

export default Withdraw;

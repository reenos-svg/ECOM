import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../Redux/rtk/userApi";
import toast from "react-hot-toast";
import { getInitials } from "../../utils/GetInitials";

const ProfileDetails = () => {
  const { data: userDetails, error, isLoading } = useGetUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error Loading the Profile Data</div>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const name = getInitials(userDetails?.user.name);

  return (
    <div className="flex overflow-hidden flex-col gap-4 pt-10 md:pt-20 min-h-screen w-full md:mx-auto bg-orange-100 rounded-lg items-center">
      <div className="border-2 font-ubuntu rounded-full p-8 h-28 w-28 text-center bg-slate-300">
        <span className="text-4xl font-ubuntu text-center font-semibold">
          {name}
        </span>
      </div>
      <Formik
        initialValues={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          name: userDetails?.user.name || "",

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          email: userDetails?.user.email || "",

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          phone: userDetails?.user.phoneNumber || "",

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          address: userDetails?.user.address || "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await updateUser(values).unwrap();
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
          <Form className="flex flex-col gap-4 w-full p-6 md:w-3/4 lg:w-1/2 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="font-ubuntu">Name</label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className={`border-2 font-ubuntu p-2 rounded-lg ${
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
                <label htmlFor="email" className="font-ubuntu">Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`border-2 font-ubuntu p-2 rounded-lg ${
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
                <label htmlFor="phone" className="font-ubuntu">Phone</label>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  className={`border-2 font-ubuntu p-2 rounded-lg ${
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
                <label htmlFor="address" className="font-ubuntu">Address</label>
                <Field
                  name="address"
                  type="text"
                  placeholder="Enter your address"
                  className={`border-2 font-ubuntu p-2 rounded-lg ${
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
              className="bg-orange-500 w-full md:w-60 text-white p-2 rounded-lg hover:bg-orange-600"
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

export default ProfileDetails;

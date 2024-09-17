import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/ReusableComp/Loader";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/slice/authSlice";
import { useState } from "react";
import { EyeIcon, EyeIconOff } from "../../Components/Icons/Icons";

interface LoginValues {
  email: string;
  password: string;
}

const VendorLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  const handleSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/vendor/login",
        values,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        throw new Error("Login failed: No data received from server");
      }

      const vendor = response.data;

      if (vendor && vendor.token) {
        // Update Redux state with vendor info
        dispatch(setUser(vendor));
        // Optionally save token to local storage
        localStorage.setItem("token", vendor.token);

        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsError(true);
      // Handle error (e.g., display error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-20 h-screen bg-orange-100 items-center">
      {isError && (
        <div className="text-red-500 mt-4">
          Login failed. Please try again later.
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4 w-full max-w-md border-2 p-8 rounded-3xl border-orange-500 bg-white shadow-xl">
              <label className="font-ubuntu font-semibold text-3xl text-orange-500">
                Login
              </label>

              <div className="flex flex-col gap-1">
                <Field
                  name="email"
                  type="text"
                  placeholder="Enter your Email Address"
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

              <div className="flex flex-col gap-1 relative">
                <div className="flex flex-row gap-1 items-center justify-between border-2 p-2 rounded-lg">
                  <Field
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full outline-none p-2${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="flex justify-end items-center pr-3"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeIconOff /> : <EyeIcon />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
              >
                Submit
              </button>
              <span>
                New to aarem?{" "}
                <a
                  href="/vendor/register"
                  className="text-orange-500 underline"
                >
                  Sign Up Here
                </a>
              </span>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default VendorLogin;

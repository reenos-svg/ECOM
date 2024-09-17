import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../../Components/ReusableComp/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { EyeIcon, EyeIconOff } from "../../Components/Icons/Icons";

interface FormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  terms: boolean;
}

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setIsError(false);

    try {
      await axios.post("http://localhost:3000/api/v1/user/register", values);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-20 bg-orange-100 min-h-screen items-center">
      {isError && (
        <div className="text-red-500 mt-4">
          Registration failed. Please try again later.
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            phone: "",
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4 w-full max-w-md border-2 p-8 rounded-3xl border-orange-500 bg-white shadow-xl">
              <label className="font-ubuntu font-semibold text-3xl text-orange-500 text-center">
                Sign Up
              </label>

              <div className="flex flex-col gap-1">
                <Field
                  name="name"
                  type="text"
                  placeholder="Your Name"
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
              <div className="flex flex-col gap-1">
                <Field
                  name="phone"
                  type="text"
                  placeholder="Phone Number"
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

              <div className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="terms"
                  className="w-4 h-4 text-orange-500 focus:ring-orange-400 accent-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-orange-500 underline">
                    terms and conditions
                  </a>
                </label>
              </div>
              <ErrorMessage
                name="terms"
                component="div"
                className="text-red-500"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                Submit
              </button>

              <span>
                Already have an account?{" "}
                <a href="/login" className="text-orange-500 underline">
                  Login here
                </a>
              </span>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Signup;

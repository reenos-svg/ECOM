import { memo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSubscribeNewsletterMutation } from "../../Redux/rtk/newsLetterApi";
import Button from "../ReusableComp/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define types for form values
interface FormValues {
  email: string;
}

const NewsCard = memo(() => {
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();
  const navigate = useNavigate();

  const handleShopNewArrivals = () => {
    navigate("/shop-products");
  };

  const initialValues: FormValues = { email: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  const handleSubscribe = async (
    values: FormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      await subscribeNewsletter(values.email).unwrap();
      toast.success("Subscribed successfully");
      resetForm();
    } catch (error) {
      toast.error("Failed to subscribe");
      console.error("Failed to subscribe:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-8 items-center gap-20">
      <div className="md:h-96 md:w-3/5 rounded-xl text-white bg-orange-700 p-6 flex flex-col gap-4">
        <h1 className="font-ubuntu font-semibold md:text-5xl text-2xl p-4">
          A Journey Of Trend Exploration And Self-Identity
        </h1>
        <p className="font-ubuntu font-medium text-xl px-4">
          Each piece of clothing becomes a page of your story that we hope will
          be carved in every detail and meticulous stitching.
        </p>
        <Button
          btnContent="Shop Now"
          btnType="shopNewArrivals"
          btnOnClick={handleShopNewArrivals}
        />
      </div>
      <div className="md:h-96 p-6 md:w-3/5 rounded-xl text-white bg-orange-700">
        <h1 className="md:w-60 md:text-6xl text-3xl font-medium font-ubuntu">
          aarem
        </h1>
        <div className="flex flex-col gap-6 justify-end items-baseline h-72">
          <h1 className="md:w-60 text-3xl md:text-5xl font-medium font-ubuntu">
            Join Our Newsletter
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubscribe}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    className="h-14 p-4 bg-orange-700 border-2 border-white rounded-full md:w-96 outline-none placeholder-white font-ubuntu "
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                  <Button
                    btnType="subscribe"
                    btnContent={
                      isSubmitting || isLoading ? "Subscribing..." : "Subscribe"
                    }
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
});

export default NewsCard;

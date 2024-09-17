import { FC } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddReviewMutation } from "../../Redux/rtk/productApi";
import { selectUserDetails } from "../../Redux/selector/SelectAuthData";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import { PiUserCircle } from "react-icons/pi";

interface ReviewProps {
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  _id: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: ReviewProps[];
}

const ProductReviews: FC<ProductReviewsProps> = ({ productId, reviews }) => {
  const { isLoggedIn, id } = useSelector(selectUserDetails);
  const [addReview] = useAddReviewMutation();


  const formik = useFormik({
    initialValues: { rating: 0, comment: "" },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .required("Rating is required"),
      comment: Yup.string().required("Comment is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await addReview({
          userId: id,
          productId,
          review: {
            rating: values.rating,
            comment: values.comment,
          },
        });
        if (response.data) {
          toast.success("Review added successfully");
          resetForm();
        } else {
          toast.error("Failed to add Review");
        }
      } catch (error) {
        toast.error("Failed to add review");
      }
    },
  });

  const handleRatingChange = (rating: number) => {
    formik.setFieldValue("rating", rating);
  };

  return (
    <div>
      {isLoggedIn && (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <h1 className="font-ubuntu text-2xl font-medium">Add a Review....</h1>
          <label className="block mb-2">
            <StarRating
              rating={formik.values.rating}
              onRatingChange={handleRatingChange}
            />
          </label>
          {formik.touched.rating && formik.errors.rating ? (
            <div className="text-red-500">{formik.errors.rating}</div>
          ) : null}
          <label className="block mb-2">
            Comment:
            <textarea
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="comment"
              required
              className="w-full p-2 mt-1 border rounded-md"
            />
          </label>
          {formik.touched.comment && formik.errors.comment ? (
            <div className="text-red-500">{formik.errors.comment}</div>
          ) : null}
          <button
            type="submit"
            className="px-4 py-2 mt-2 rounded-xl bg-black text-white font-ubuntu"
          >
            Submit Review
          </button>
        </form>
      )}

      {reviews.map((review) => (
        <div key={review._id} className="my-4 p-4 border rounded-md shadow-sm">
          <div className="flex flex-row gap-4 items-center mb-2">
            <PiUserCircle size={"2.8rem"} />
            <span className="font-ubuntu text-xl">{review.userId.name}</span>
          </div>
          <StarRating rating={review.rating} readOnly />
          <p className="mt-2 font-ubuntu text-lg text-desc">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;

import { FC, useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: FC<StarRatingProps> = ({ rating, onRatingChange, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-row gap-1 items-center">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange && onRatingChange(ratingValue)}
              className="hidden"
              disabled={readOnly}
            />
            <svg
              className={`w-6 h-6 cursor-pointer ${readOnly ? "" : "cursor-pointer"}`}
              fill={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              stroke="#000"
              strokeWidth="1"
              viewBox="0 0 24 24"
              onMouseEnter={() => !readOnly && setHover(ratingValue)}
              onMouseLeave={() => !readOnly && setHover(0)}
            >
              <path d="M12 .587l3.668 7.429 8.207 1.192-5.938 5.77 1.404 8.186L12 18.896l-7.341 3.858L6.063 15.1 0 9.33l8.332-1.214z" />
            </svg>
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;

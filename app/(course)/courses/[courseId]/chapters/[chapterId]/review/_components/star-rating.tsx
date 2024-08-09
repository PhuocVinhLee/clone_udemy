// components/StarRating.tsx
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              className="w-8 h-8"
              fill={ratingValue <= (hover || value) ? "#ffd700" : "#ccc"}
            />
          </button>
        );
      })}
    </div>
  );
};

import { Icons } from "../ui/icons";

type RatingsProps = {
  rating: number;
};

export default function Ratings({ rating }: RatingsProps) {
  return (
    <div className={`flex items-center gap-1 mb-1`}>
      {Array.from({ length: 5 }, (_, i) => {
        return (
          <Icons.Star
            key={i}
            className={`h-4 w-4`}
            fill={i < Number(rating.toFixed(0)) ? undefined : "#8a8a8a"}
          />
        );
      })}
    </div>
  );
}

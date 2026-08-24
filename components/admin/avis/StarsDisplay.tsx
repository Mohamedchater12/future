import { IconStarFilled } from "@tabler/icons-react";

export default function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStarFilled key={i} size={14} className={i < rating ? "text-purple-light" : "text-white/10"} />
      ))}
    </div>
  );
}

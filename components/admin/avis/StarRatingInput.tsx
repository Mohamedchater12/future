"use client";

import { IconStarFilled } from "@tabler/icons-react";

export default function StarRatingInput({
  value,
  onChange,
  getAriaLabel = (n) => `${n} star${n > 1 ? "s" : ""}`,
}: {
  value: number;
  onChange: (value: number) => void;
  getAriaLabel?: (n: number) => string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={getAriaLabel(n)}
        >
          <IconStarFilled size={22} className={n <= value ? "text-purple-light" : "text-white/10"} />
        </button>
      ))}
    </div>
  );
}

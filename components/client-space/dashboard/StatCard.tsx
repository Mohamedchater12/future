import Link from "next/link";
import type { Icon } from "@tabler/icons-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
  href,
}: {
  label: string;
  value: number;
  icon: Icon;
  highlight?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-purple/40 hover:bg-white/[0.05]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-base-gray">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple/15 text-purple-light">
          <Icon size={18} stroke={1.5} />
        </div>
      </div>
      <p className="mt-4 font-heading text-3xl font-bold text-white">{value}</p>
      {highlight && <p className="mt-1 text-xs font-medium text-purple-light">{highlight}</p>}
    </Link>
  );
}

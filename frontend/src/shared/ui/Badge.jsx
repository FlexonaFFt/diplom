/**
 * Нейтральный бейдж.
 * variants: default | success | warn
 * props:
 * - variant?: "default" | "success" | "warn"
 * - children: ReactNode
 * - className?: string
 */
const variants = {
  default:
    "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-200",
  success:
    "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  warn:
    "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
};

export default function Badge({ variant = "default", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant] || variants.default,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

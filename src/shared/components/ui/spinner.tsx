import cn from "@/shared/utils/cn";

const SPINNER_SIZES = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

interface SpinnerProps {
  size?: keyof typeof SPINNER_SIZES;
  label?: string;
  className?: string;
}

/**
 * Calm loading indicator. Opacity-free border spinner using the primary
 * token; no flashing, shimmer, or continuous decoration. The global
 * reduced-motion guard settles the rotation for users who request it.
 */
const Spinner = ({ size = "md", label = "Loading", className }: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full",
        "border-primary/20 border-t-primary",
        SPINNER_SIZES[size],
        className,
      )}
    />
  );
};

export default Spinner;

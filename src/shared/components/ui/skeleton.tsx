import cn from "@/shared/utils/cn";

interface SkeletonProps {
  className?: string;
}

/**
 * Content placeholder for known shapes (text rows, cards, table rows).
 * Muted surface with a still, subtle pulse — no shimmer gradients or
 * flashing. Always decorative: hidden from assistive technology, with the
 * loading meaning announced by the surrounding status region instead.
 */
const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-surface-muted", className)}
    />
  );
};

export default Skeleton;

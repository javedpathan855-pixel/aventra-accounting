import cn from "@/shared/utils/cn";

import type { ReactNode, Ref } from "react";

interface CardProps {
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
  className?: string;
}

const Card = ({ ref, children, className }: CardProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        "p-6 bg-background rounded-md shadow-primary-lg dark:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;

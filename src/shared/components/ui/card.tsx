import cn from "@/shared/utils/cn";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        "p-6 bg-background rounded-md dark:shadow-xl dark:shadow-black/30 shadow-[0_0_16px_rgba(240,88,3,0.20)]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;

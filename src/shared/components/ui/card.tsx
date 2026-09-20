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
        "p-6 bg-background rounded-md shadow-primary-lg dark:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;

import cn from "@/shared/utils/cn";
import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={cn(
        "font-montserrat text-sm font-medium text-foreground",
        className,
      )}
    >
      {children}
    </label>
  );
};

export default Label;

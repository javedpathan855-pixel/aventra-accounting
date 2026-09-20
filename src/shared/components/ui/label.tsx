import cn from "@/shared/utils/cn";
import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const Label = ({ htmlFor, children, className, ...props }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={cn()} {...props}>
      {children}
    </label>
  );
};

export default Label;

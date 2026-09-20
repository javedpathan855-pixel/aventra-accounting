import cn from "@/shared/utils/cn";
import { InputHTMLAttributes } from "react";

const INPUT_VARRIANTS = {
  default:
    "border border-border rounded-md outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(240,88,3,0.45)]  transition-shadow",
  error:
    "border border-destructive rounded-md outline-none focus:border-destructive focus:shadow-[0_0_20px_rgba(255,0,51,0.45)]  transition-shadow",
  success:
    "border border-success rounded-md outline-none focus:border-success focus:shadow-[0_0_20px_rgba(76,175,80,0.45)]  transition-shadow",
  warning:
    "border border-warning rounded-md outline-none focus:border-warning focus:shadow-[0_0_20px_rgba(255,152,0,0.45)]  transition-shadow",
  info: "border border-info rounded-md outline-none focus:border-info focus:shadow-[0_0_20px_rgba(33,150,143,0.45)]  transition-shadow",
};

const SIZES = {
  sm: "py-2 px-3 text-sm",
  md: "py-3 px-4 text-base",
  lg: "py-4 px-6 text-lg",
  icon: "w-10 h-10 p-0",
};

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  variant?: keyof typeof INPUT_VARRIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  placeholder?: string;
}

const Input = ({
  variant = "default",
  size = "md",
  className,
  placeholder = "Enter your value",
  ...props
}: InputProps) => {
  return (
    <input
      type="text"
      {...props}
      placeholder={placeholder}
      className={cn(
        INPUT_VARRIANTS[variant],
        SIZES[size],
        className,
        "font-montserrat",
      )}
    />
  );
};

export default Input;

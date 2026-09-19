import cn from "@/shared/utils/cn";
import { ButtonHTMLAttributes } from "react";
const BUTTON_VARRIANTS = {
  default:
    "rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(240,88,3,0.45)] dark:shadow-[0_0_25px_rgba(240,88,3,0.50)] transition-shadow cursor-pointer",
  secondary:
    "rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_20px_rgba(240,88,3,0.45)] dark:shadow-[0_0_25px_rgba(240,88,3,0.50)] transition-shadow cursor-pointer",
  outline:
    "rounded-md bg-transparent border border-primary text-primary hover:bg-primary/10 transition-shadow cursor-pointer",
  ghost: "rounded-md hover:bg-primary/20 cursor-pointer",
  link: "rounded-md text-primary underline underline-offset-2 cursor-pointer",
};

const SIZES = {
  sm: "py-2 px-3 text-sm",
  md: "py-3 px-4 text-base",
  lg: "py-4 px-6 text-lg",
  icon: "w-10 h-10 p-0",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARRIANTS;
  size?: keyof typeof SIZES;
}

const Button = ({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        BUTTON_VARRIANTS[variant],
        SIZES[size],
        className,
        "font-montserrat",
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

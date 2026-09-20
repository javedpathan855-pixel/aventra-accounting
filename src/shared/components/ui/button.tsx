import cn from "@/shared/utils/cn";
import { ButtonHTMLAttributes } from "react";

const BUTTON_VARIANTS = {
  default:
    "rounded-md bg-primary text-primary-foreground shadow-primary-lg hover:bg-primary/90 hover:shadow-primary-lg active:scale-[0.98]",

  secondary:
    "rounded-md bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 hover:shadow-lg active:scale-[0.98]",

  outline:
    "rounded-md border border-primary bg-transparent text-primary hover:bg-primary-muted hover:shadow-lg active:scale-[0.98]",

  ghost:
    "rounded-md bg-transparent text-foreground hover:bg-primary-muted hover:text-primary active:scale-[0.98]",

  link: "rounded-md bg-transparent text-primary underline underline-offset-2 hover:text-primary/80",
};

const SIZES = {
  sm: "min-h-9 px-3 py-2 text-sm",
  md: "min-h-10 px-4 py-2.5 text-base",
  lg: "min-h-11 px-6 py-3 text-lg",
  icon: "h-10 w-10 p-0",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof SIZES;
}

const Button = ({
  children,
  className,
  variant = "default",
  size = "md",
  type = "button",
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2",
        "whitespace-nowrap",
        "font-montserrat font-medium",
        "transition-all duration-200 ease-out",

        // Focus
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring/30",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",

        // Disabled
        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        "disabled:shadow-none",

        // Variant
        BUTTON_VARIANTS[variant],

        // Size
        SIZES[size],

        // Custom styles
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

import cn from "@/shared/utils/cn";
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

const INPUT_VARIANTS = {
  default:
    "border border-border rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 focus:shadow-primary-md transition-all duration-200",
  error:
    "border border-error rounded-md outline-none focus:border-error focus:ring-2 focus:ring-error/30 focus:shadow-md transition-all duration-200",
  success:
    "border border-success rounded-md outline-none focus:border-success focus:ring-2 focus:ring-success/30 focus:shadow-md transition-all duration-200",
  warning:
    "border border-warning rounded-md outline-none focus:border-warning focus:ring-2 focus:ring-warning/30 focus:shadow-md transition-all duration-200",
  info: "border border-info rounded-md outline-none focus:border-info focus:ring-2 focus:ring-info/30 focus:shadow-md transition-all duration-200",
};

const SIZES = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-4 text-base",
  lg: "py-3 px-6 text-lg",
  icon: "w-10 h-10 p-0",
};

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  variant?: keyof typeof INPUT_VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  /**
   * Optional decorative node rendered before the input text. It is
   * non-interactive (pointer events pass through to the input); mark
   * decorative icons with aria-hidden at the call site.
   */
  prefix?: ReactNode;
  /**
   * Optional node rendered after the input text (e.g. a visibility
   * toggle). Unlike prefix it remains interactive when it contains
   * controls; keep it a real button/link with an accessible name.
   */
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputRef,
      variant = "default",
      size = "md",
      className,
      placeholder = "Enter your value",
      prefix,
      suffix,
      ...props
    },
    ref,
  ) => {
    if (!prefix && !suffix) {
      return (
        <input
          ref={ref ?? inputRef}
          type="text"
          {...props}
          placeholder={placeholder}
          className={cn(
            INPUT_VARIANTS[variant],
            SIZES[size],
            className,
            "font-montserrat",
          )}
        />
      );
    }

    return (
      <span className="relative flex w-full items-center">
        {prefix ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 flex items-center text-input-placeholder"
          >
            {prefix}
          </span>
        ) : null}
        <input
          ref={ref ?? inputRef}
          type="text"
          {...props}
          placeholder={placeholder}
          className={cn(
            INPUT_VARIANTS[variant],
            SIZES[size],
            prefix && "pl-9",
            suffix && "pr-10",
            "w-full",
            className,
            "font-montserrat",
          )}
        />
        {suffix ? (
          <span className="absolute right-2 flex items-center">{suffix}</span>
        ) : null}
      </span>
    );
  },
);

Input.displayName = "Input";

export default Input;

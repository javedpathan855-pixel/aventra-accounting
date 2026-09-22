"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import cn from "@/shared/utils/cn";
import { getFieldErrorId } from "@/shared/utils/form-ids";
import AuthBackButton from "../components/auth-back-button";

import { OtpSchema } from "../../domain/schemas/otp.schema";

interface AuthOtpFormProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onBackToLogin?: () => void;
  onResend?: () => void;
  disabled?: boolean;
  className?: string;
}

const AuthOtpForm = ({
  length = 6,
  onComplete,
  onBackToLogin,
  onResend,
  disabled = false,
  className,
}: AuthOtpFormProps) => {
  const [otp, setOtp] = useState<string[]>(Array.from({ length }, () => ""));
  const [otpError, setOtpError] = useState<string | undefined>(undefined);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusInput = (index: number) => {
    if (index < 0 || index >= length) {
      return;
    }

    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;

    setOtp(nextOtp);
    setOtpError(undefined);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }

    const completedOtp = nextOtp.join("");

    if (completedOtp.length === length && !nextOtp.includes("")) {
      onComplete?.(completedOtp);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      const nextOtp = [...otp];

      if (nextOtp[index]) {
        nextOtp[index] = "";
        setOtp(nextOtp);
        return;
      }

      if (index > 0) {
        nextOtp[index - 1] = "";
        setOtp(nextOtp);
        focusInput(index - 1);
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();

      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pastedValue) {
      return;
    }

    const nextOtp = Array.from(
      { length },
      (_, index) => pastedValue[index] ?? "",
    );

    setOtp(nextOtp);
    setOtpError(undefined);

    const nextFocusIndex = Math.min(pastedValue.length, length - 1);

    focusInput(nextFocusIndex);

    if (pastedValue.length === length) {
      onComplete?.(pastedValue);
    }
  };

  const handleVerify = () => {
    const completedOtp = otp.join("");
    const result = OtpSchema.safeParse(completedOtp);

    if (!result.success) {
      setOtpError(
        result.error.flatten().formErrors[0] ?? "Enter the 6-digit code",
      );
      return;
    }

    setOtpError(undefined);

    if (completedOtp.length === length && !otp.includes("")) {
      onComplete?.(completedOtp);
    }
  };

  const handleResend = () => {
    setOtp(Array.from({ length }, () => ""));
    setOtpError(undefined);
    focusInput(0);
    onResend?.();
  };

  const isComplete = otp.join("").length === length && !otp.includes("");

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div className="w-full max-w-md">
        {onBackToLogin && (
          <div className="mb-2 flex justify-start">
            <AuthBackButton onClick={onBackToLogin} />
          </div>
        )}
        <Card className="w-full flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <h2 className="font-montserrat text-2xl font-bold">
              Two-Step Verification
            </h2>
            <p className="font-montserrat text-base text-muted">
              Enter the {length}-digit code sent to your email
            </p>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleVerify();
            }}
          >
            <div
              className="flex w-full items-center justify-center gap-2 sm:gap-3 py-2"
              role="group"
              aria-label="One-time password"
            >
              {otp.map((value, index) => (
                <Input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={value}
                  disabled={disabled}
                  placeholder=""
                name={`otp-${index + 1}`}
                required
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`OTP digit ${index + 1}`}
                aria-invalid={Boolean(otpError)}
                aria-describedby={
                  otpError ? getFieldErrorId("otp") : undefined
                }
                variant={otpError ? "error" : "default"}
                  onChange={(event) => updateOtp(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  size="icon"
                  className="h-12 min-w-0 flex-1 max-w-14 text-center text-lg font-semibold sm:h-14"
                />
              ))}
          </div>
          <FieldError
            id={getFieldErrorId("otp")}
            message={otpError}
            className="text-center"
          />
          <Button
            type="submit"
            className="mt-2"
            disabled={disabled || !isComplete}
          >
            Verify OTP
          </Button>
          </form>
        </Card>
      </div>
      <div className="flex items-center justify-center">
        <p className="font-montserrat text-base text-muted">
          Didn&apos;t receive the code?
        </p>
        <Button variant="link" onClick={handleResend} disabled={disabled}>
          Resend OTP
        </Button>
      </div>
    </div>
  );
};

export default AuthOtpForm;

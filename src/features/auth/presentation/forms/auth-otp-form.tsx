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
import { useToasts } from "@/shared/components/ui/toast";
import cn from "@/shared/utils/cn";
import { getFieldErrorId } from "@/shared/utils/form-ids";
import AuthBackButton from "../components/auth-back-button";
import { resendOtpAction, verifyOtpAction } from "../actions/auth-actions";

import { OtpSchema } from "../../domain/schemas/otp.schema";

interface AuthOtpFormProps {
  email: string;
  length?: number;
  onVerified: (redirectTo: string) => void;
  onBackToLogin?: () => void;
  disabled?: boolean;
  className?: string;
}

/** Frontend resend hint only — the server enforces the real cooldown. */
const RESEND_HINT_SECONDS = 30;

const AuthOtpForm = ({
  email,
  length = 6,
  onVerified,
  onBackToLogin,
  disabled = false,
  className,
}: AuthOtpFormProps) => {
  const [otp, setOtp] = useState<string[]>(Array.from({ length }, () => ""));
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendHintLeft, setResendHintLeft] = useState(0);
  const { toast } = useToasts();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const busy = disabled || verifying;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendHintLeft <= 0) {
      return;
    }
    const timer = setTimeout(() => setResendHintLeft((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendHintLeft]);

  const focusInput = (index: number) => {
    if (index < 0 || index >= length) {
      return;
    }

    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const verifyCode = async (code: string) => {
    if (busy) {
      return;
    }
    const parsed = OtpSchema.safeParse(code);
    if (!parsed.success) {
      setOtpError(parsed.error.flatten().formErrors[0] ?? "Enter the 6-digit code");
      return;
    }

    setOtpError(undefined);
    setVerifying(true);
    try {
      const response = await verifyOtpAction({ email, otp: code });
      if (response.success) {
        toast({ title: "Verification successful", tone: "success" });
        onVerified(response.data.redirectTo);
        return;
      }
      setOtpError(response.error.message);
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
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
      void verifyCode(completedOtp);
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
      void verifyCode(pastedValue);
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

    if (completedOtp.length === length && !otp.includes("")) {
      void verifyCode(completedOtp);
    }
  };

  const handleResend = async () => {
    if (busy || resending || resendHintLeft > 0) {
      return;
    }
    setResending(true);
    try {
      const response = await resendOtpAction({ email });
      if (response.success) {
        setOtp(Array.from({ length }, () => ""));
        setOtpError(undefined);
        focusInput(0);
        setResendHintLeft(RESEND_HINT_SECONDS);
        toast({ title: "Verification code sent", tone: "success" });
        return;
      }
      setOtpError(response.error.message);
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
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
              Enter the {length}-digit code sent to {email || "your email"}
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
                  disabled={busy}
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
            disabled={busy || !isComplete}
          >
            {verifying ? "Verifying…" : "Verify OTP"}
          </Button>
          </form>
        </Card>
      </div>
      <div className="flex items-center justify-center">
        <p className="font-montserrat text-base text-muted">
          Didn&apos;t receive the code?
        </p>
        <Button
          variant="link"
          onClick={handleResend}
          disabled={busy || resending || resendHintLeft > 0}
        >
          {resending
            ? "Sending…"
            : resendHintLeft > 0
              ? `Resend OTP (${resendHintLeft}s)`
              : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
};

export default AuthOtpForm;

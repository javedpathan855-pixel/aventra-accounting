"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import FieldError from "@/shared/components/ui/field-error";
import Label from "@/shared/components/ui/label";
import PasswordInput from "@/shared/components/ui/password-input";
import { useToasts } from "@/shared/components/ui/toast";
import { getFieldErrorId } from "@/shared/utils/form-ids";
import AuthBackButton from "../components/auth-back-button";
import { resetPasswordAction } from "../actions/auth-actions";

interface AuthResetFormProps {
  token: string;
  onBackToLogin: () => void;
}

interface ResetFieldErrors {
  password?: string;
  confirmPassword?: string;
}

const AuthResetForm = ({ token, onBackToLogin }: AuthResetFormProps) => {
  const [fieldErrors, setFieldErrors] = useState<ResetFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToasts();
  const router = useRouter();

  const clearFieldError = (field: keyof ResetFieldErrors) => {
    setFieldErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      token,
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    setSubmitting(true);
    try {
      const response = await resetPasswordAction(payload);
      if (!response.success) {
        if (response.fieldErrors) {
          setFieldErrors({
            password: response.fieldErrors.password,
            confirmPassword: response.fieldErrors.confirmPassword,
          });
          return;
        }
        setFieldErrors({});
        toast({ title: response.error.message, tone: "error" });
        return;
      }
      toast({ title: "Password updated. Please sign in with your new password.", tone: "success" });
      router.push(response.data.redirectTo);
    } catch {
      toast({ title: "Something went wrong. Please try again.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-start">
          <AuthBackButton onClick={onBackToLogin} />
        </div>
        <Card className="w-full flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <h2 className="font-montserrat text-2xl font-bold">Set a new password</h2>
            <p className="font-montserrat text-base text-muted">
              Choose a password of at least 8 characters
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">New password</Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                required
                placeholder="New password"
                variant={fieldErrors.password ? "error" : "default"}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? getFieldErrorId("password") : undefined
                }
                onChange={() => clearFieldError("password")}
              />
              <FieldError
                id={getFieldErrorId("password")}
                message={fieldErrors.password}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                placeholder="Confirm new password"
                variant={fieldErrors.confirmPassword ? "error" : "default"}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={
                  fieldErrors.confirmPassword
                    ? getFieldErrorId("confirmPassword")
                    : undefined
                }
                onChange={() => clearFieldError("confirmPassword")}
              />
              <FieldError
                id={getFieldErrorId("confirmPassword")}
                message={fieldErrors.confirmPassword}
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating…" : "Update password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AuthResetForm;

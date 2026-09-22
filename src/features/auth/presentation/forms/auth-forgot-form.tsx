import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

import Card from "@/shared/components/ui/card";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import Button from "@/shared/components/ui/button";
import { getFieldErrorId } from "@/shared/utils/form-ids";
import AuthBackButton from "../components/auth-back-button";

import { ForgotPasswordSchema } from "../../domain/schemas/forgot-password.schema";

interface AuthForgotFormProps {
  onBackToLogin: () => void;
}

interface ForgotPasswordFieldErrors {
  email?: string;
}

const AuthForgotForm = ({ onBackToLogin }: AuthForgotFormProps) => {
  const [fieldErrors, setFieldErrors] =
    useState<ForgotPasswordFieldErrors>({});

  const clearFieldError = (field: keyof ForgotPasswordFieldErrors) => {
    setFieldErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = ForgotPasswordSchema.safeParse({
      email: formData.get("email"),
    });

    if (!result.success) {
      const flatErrors = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: flatErrors.email?.[0],
      });
      return;
    }

    setFieldErrors({});
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-start">
          <AuthBackButton onClick={onBackToLogin} />
        </div>
        <Card className="w-full flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <h2 className="font-montserrat text-2xl font-bold">
              Forgot password?
            </h2>
            <p className="font-montserrat text-base text-muted">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                placeholder="aventra@nextgen.in"
                prefix={<Mail aria-hidden="true" className="h-4 w-4" />}
                variant={fieldErrors.email ? "error" : "default"}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? getFieldErrorId("email") : undefined
                }
                onChange={() => clearFieldError("email")}
              />
              <FieldError
                id={getFieldErrorId("email")}
                message={fieldErrors.email}
              />
            </div>
            <Button type="submit">Send Reset Link</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AuthForgotForm;

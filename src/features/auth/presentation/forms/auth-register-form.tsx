import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import PasswordInput from "@/shared/components/ui/password-input";
import { useToasts } from "@/shared/components/ui/toast";
import { getFieldErrorId } from "@/shared/utils/form-ids";
import AuthBackButton from "../components/auth-back-button";
import { registerAction } from "../actions/auth-actions";

import { RegisterSchema } from "../../domain/schemas/register.schema";

interface AuthRegisterFormProps {
  onBackToLogin: () => void;
  goToOtp: (email: string) => void;
}

interface RegisterFieldErrors {
  name?: string;
  organization?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const AuthRegisterForm = ({
  onBackToLogin,
  goToOtp,
}: AuthRegisterFormProps) => {
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToasts();

  const clearFieldError = (field: keyof RegisterFieldErrors) => {
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
      name: formData.get("name"),
      organization: formData.get("organization"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      terms: formData.get("terms") === "on",
    };
    const result = RegisterSchema.safeParse(payload);

    if (!result.success) {
      const flatErrors = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: flatErrors.name?.[0],
        organization: flatErrors.organization?.[0],
        email: flatErrors.email?.[0],
        password: flatErrors.password?.[0],
        confirmPassword: flatErrors.confirmPassword?.[0],
        terms: flatErrors.terms?.[0],
      });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      const response = await registerAction(payload);
      if (response.success) {
        toast({ title: "Verification code sent", description: "Check your inbox for the 6-digit code.", tone: "success" });
        goToOtp(response.data.email);
        return;
      }
      if (response.fieldErrors) {
        setFieldErrors({
          name: response.fieldErrors.name,
          organization: response.fieldErrors.organization,
          email: response.fieldErrors.email,
          password: response.fieldErrors.password,
          confirmPassword: response.fieldErrors.confirmPassword,
          terms: response.fieldErrors.terms,
        });
        return;
      }
      toast({ title: response.error.message, tone: "error" });
    } catch {
      toast({ title: "Something went wrong. Please try again.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-start">
          <AuthBackButton onClick={onBackToLogin} />
        </div>
        <Card className="w-full flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <h2 className="font-montserrat text-2xl font-bold">Register</h2>
            <p className="font-montserrat text-base text-muted">
              Create a new account
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                placeholder="Rahul Kumar"
                variant={fieldErrors.name ? "error" : "default"}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={
                  fieldErrors.name ? getFieldErrorId("name") : undefined
                }
                onChange={() => clearFieldError("name")}
              />
              <FieldError
                id={getFieldErrorId("name")}
                message={fieldErrors.name}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="organization">Organization</Label>
              <Input
                type="text"
                id="organization"
                name="organization"
                autoComplete="organization"
                required
                placeholder="Nextgen Services"
                variant={fieldErrors.organization ? "error" : "default"}
                aria-invalid={Boolean(fieldErrors.organization)}
                aria-describedby={
                  fieldErrors.organization
                    ? getFieldErrorId("organization")
                    : undefined
                }
                onChange={() => clearFieldError("organization")}
              />
              <FieldError
                id={getFieldErrorId("organization")}
                message={fieldErrors.organization}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Business Email</Label>
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
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                required
                placeholder="Password"
                variant={fieldErrors.password ? "error" : "default"}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password
                    ? getFieldErrorId("password")
                    : undefined
                }
                onChange={() => clearFieldError("password")}
              />
              <FieldError
                id={getFieldErrorId("password")}
                message={fieldErrors.password}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                placeholder="Confirm Password"
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
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <Checkbox
                  id="terms"
                  name="terms"
                  label="I agree to the Terms of Service and Privacy Policy"
                  required
                  aria-invalid={Boolean(fieldErrors.terms)}
                  aria-describedby={
                    fieldErrors.terms ? getFieldErrorId("terms") : undefined
                  }
                  onChange={() => clearFieldError("terms")}
                />
              </div>
              <FieldError
                id={getFieldErrorId("terms")}
                message={fieldErrors.terms}
              />
            </div>
            <Button type="submit" className="mt-4" disabled={submitting}>
              {submitting ? "Creating account…" : "Register"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AuthRegisterForm;

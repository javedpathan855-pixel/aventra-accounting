import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import Divider from "@/shared/components/ui/divider";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import PasswordInput from "@/shared/components/ui/password-input";
import { useToasts } from "@/shared/components/ui/toast";
import { getFieldErrorId } from "@/shared/utils/form-ids";

import { loginAction } from "../actions/auth-actions";
import { LoginSchema } from "../../domain/schemas/login.schema";

interface AuthLoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  goToOtp: (email: string) => void;
}

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

const AuthLoginForm = ({
  onForgotPassword,
  onRegister,
  goToOtp,
}: AuthLoginFormProps) => {
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToasts();
  const router = useRouter();

  const clearFieldError = (field: keyof LoginFieldErrors) => {
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
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const result = LoginSchema.safeParse(payload);

    if (!result.success) {
      const flatErrors = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: flatErrors.email?.[0],
        password: flatErrors.password?.[0],
      });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      const response = await loginAction(payload);
      if (!response.success) {
        if (response.fieldErrors) {
          setFieldErrors({
            email: response.fieldErrors.email,
            password: response.fieldErrors.password,
          });
          return;
        }
        toast({ title: response.error.message, tone: "error" });
        return;
      }
      if (response.data.status === "verification-required" && response.data.email) {
        toast({ title: "Please verify your email", description: "Enter the code we sent to continue.", tone: "warning" });
        goToOtp(response.data.email);
        return;
      }
      if (response.data.status === "authenticated" && response.data.redirectTo) {
        router.push(response.data.redirectTo);
        router.refresh();
      }
    } catch {
      toast({ title: "Something went wrong. Please try again.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <h2 className="font-montserrat text-2xl font-bold">Login</h2>
          <p className="font-montserrat text-base text-muted">
            Sign in to your account
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
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
          <div className="flex items-center justify-between gap-2">
            <Checkbox id="remember" label="Remember me!" />
            <Button variant="link" onClick={onForgotPassword}>
              Forgot password?
            </Button>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Login"}
          </Button>
          <Divider text="OR"></Divider>
          <Button variant="secondary" className="mt-2">
            Continue with Google{" "}
          </Button>
        </form>
      </Card>
      <div className="flex items-center justify-center">
        <p className="font-montserrat text-base text-muted">
          Don&apos;t have an account?
        </p>
        <Button variant="link" onClick={onRegister}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default AuthLoginForm;

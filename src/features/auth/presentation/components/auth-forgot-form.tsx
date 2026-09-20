import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import Button from "@/shared/components/ui/button";

interface AuthForgotFormProps {
  onBackToLogin: () => void;
}

const AuthForgotForm = ({ onBackToLogin }: AuthForgotFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <Button variant="link" onClick={onBackToLogin} className="p-0">
            Back to Login
          </Button>
          <h1 className="font-montserrat text-2xl font-bold">
            Forgot password?
          </h1>
          <p className="font-montserrat text-md text-muted">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="aventra@nextgen.in" />
          </div>
          <Button>Send Reset Link</Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthForgotForm;

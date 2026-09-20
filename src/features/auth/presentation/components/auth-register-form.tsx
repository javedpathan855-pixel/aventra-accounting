import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import Divider from "@/shared/components/ui/divider";

interface AuthRegisterFormProps {
  onBackToLogin: () => void;
}

const AuthRegisterForm = ({ onBackToLogin }: AuthRegisterFormProps) => {
  return (
    <div className="w-full flex justify-center flex-col gap-4">
      <Card className="w-full min-w-md flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <Button variant="link" onClick={onBackToLogin} className="p-0">
            Back to Login
          </Button>
          <h1 className="font-montserrat text-2xl font-bold">Register</h1>
          <p className="font-montserrat text-md text-muted">
            Create a new account
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Full Name</Label>
            <Input type="text" id="name" placeholder="Rahul Kumar" />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="organization">Organization</Label>
            <Input
              type="text"
              id="organization"
              placeholder="Nextgen Services"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Business Email</Label>
            <Input type="email" id="email" placeholder="aventra@nextgen.in" />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Checkbox
              id="terms"
              label="I agree to the Terms of Service and Privacy Policy"
            />
          </div>
          <Button>Register</Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthRegisterForm;

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";

const AuthLoginForm = () => {
  return (
    <Card className="min-w-md w-full flex flex-col gap-4">
      <div className="flex flex-col items-start">
        <h1 className="font-montserrat text-4xl font-bold">Login</h1>
        <p className="font-montserrat text-lg text-muted">
          Sign in to your account
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="aventra@nextgen.in" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="Password" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Checkbox id="remember" label="Remember me!" />
          <Button variant="link">Forgot password?</Button>
        </div>
        <Button>Login</Button>
      </div>
    </Card>
  );
};

export default AuthLoginForm;

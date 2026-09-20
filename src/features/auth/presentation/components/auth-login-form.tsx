import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import Divider from "@/shared/components/ui/divider";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";

const AuthLoginForm = () => {
  return (
    <div className="flex flex-col gap-4">
      {" "}
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
          <Divider text="OR"></Divider>
          <Button variant="secondary" className="mt-2">
            Continue with Google{" "}
          </Button>
        </div>
      </Card>
      <div className="flex items-center justify-center">
        <p className="font-montserrat text-base text-muted">
          Don't have an account?
        </p>
        <Button variant="link">Sign Up</Button>
      </div>
    </div>
  );
};

export default AuthLoginForm;

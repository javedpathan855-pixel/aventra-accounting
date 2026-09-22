import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <main className="min-h-dvh w-full">{children}</main>;
};

export default AuthLayout;

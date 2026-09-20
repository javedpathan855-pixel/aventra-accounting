import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {children}
    </main>
  );
};

export default AuthLayout;

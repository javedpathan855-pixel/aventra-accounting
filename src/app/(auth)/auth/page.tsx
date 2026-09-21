import AuthShowcase from "@/features/auth/presentation/components/auth-showcase";
import AuthPageClient from "@/features/auth/presentation/page/auth-page-client";

const AuthPage = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      <div className="w-full min-w-0 lg:w-1/2">
        <AuthShowcase />
      </div>
      <div className="flex w-full min-w-0 flex-1 lg:w-1/2">
        <AuthPageClient />
      </div>
    </div>
  );
};

export default AuthPage;

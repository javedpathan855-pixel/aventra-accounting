import ThemeSwitcher from "@/shared/components/theme/theme-switcher";
import AuthLoginForm from "../components/auth-login-form";
import AuthShowcase from "../components/auth-showcase";

const AuthPageClient = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="w-full h-full">
        <AuthShowcase />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-between p-6">
        <div className="w-full flex items-center justify-end">
          <ThemeSwitcher />
        </div>
        <div>
          <AuthLoginForm />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default AuthPageClient;

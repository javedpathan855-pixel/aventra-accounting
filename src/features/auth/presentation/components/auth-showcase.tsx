import AventraLogo from "@/shared/components/ui/aventra-logo";
import Card from "@/shared/components/ui/card";

const AuthShowcase = () => {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-8 p-6 lg:min-h-dvh">
      <AventraLogo />

      <div className="flex flex-col gap-8">
        <h1 className="font-montserrat text-4xl font-bold text-muted tracking-tighter p-6 sm:text-5xl">
          POWERING <span className="text-primary">BETTER </span> BUSINESS
          THROUGH BETTER <span className="text-primary">ACCOUNTING</span>.
        </h1>
        <Card className="w-full flex flex-col gap-4 items-end justify-center">
          <p className="font-signature text-muted text-base justify-center items-center content-center">
            “Aventra Accounting makes managing your business finances much
            easier. The platform is simple to understand, well organized, and
            gives you a better way to manage your everyday accounting work in
            one place.”
          </p>
          <div className="flex flex-col items-end">
            <h2 className="font-montserrat text-lg font-semibold text-primary">
              Aventra Accounting
            </h2>
            <p className="font-montserrat text-sm text-muted italic">
              NextGen Official
            </p>
          </div>
        </Card>
      </div>
      <div className="w-full flex items-center justify-between flex-wrap gap-2 border-border border-t p-6">
        <p className="font-montserrat text-xs text-muted italic">
          All rights reserved © {new Date().getFullYear()} Aventra Accounting
        </p>
        <p className="font-montserrat text-xs text-muted italic">
          Powered by{" "}
          <span className="font-bold text-primary">NextGen Services</span>
        </p>
      </div>
    </div>
  );
};
export default AuthShowcase;

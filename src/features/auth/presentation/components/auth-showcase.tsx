import AventraLogo from "@/shared/components/ui/aventra-logo";
import Card from "@/shared/components/ui/card";

const AuthShowcase = () => {
  return (
    <div className="w-full h-full flex flex-col items-start justify-between p-6">
      <AventraLogo />

      <div className="flex flex-col gap-8">
        <h1 className="font-montserrat text-6xl font-bold text-muted tracking-tighter p-6">
          POWERING <span className="text-primary">BETTER </span> BUSINESS
          THROUGH BETTER <span className="text-primary">ACCOUNTING</span>.
        </h1>
        <Card className="w-full flex flex-col gap-4 items-end justify-center">
          <p className="font-signature text-muted text-xl justify-center items-center content-center">
            “Aventra Accounting makes managing your business finances much
            easier. The platform is simple to understand, well organized, and
            gives you a better way to manage your everyday accounting work in
            one place.”
          </p>
          <div className="flex flex-col items-end">
            <h1 className="font-montserrat text-xl font-semibold text-primary">
              Aventra Accounting
            </h1>
            <p className="font-montserrat text-lg text-muted italic">
              NextGen Official
            </p>
          </div>
        </Card>
      </div>
      <div className="w-full flex item-scenter justify-between border-border border-t p-6">
        <p className="font-montserrat text-sm text-muted italic">
          All rights reserved © {new Date().getFullYear()} Aventra Accounting
        </p>
        <p className="font-montserrat text-sm text-muted italic">
          Powered by{" "}
          <span className="font-bold text-primary">NextGen Services</span>
        </p>
      </div>
    </div>
  );
};
export default AuthShowcase;

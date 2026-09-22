import Image from "next/image";

type LogoVariant = "Short" | "Long";

interface AventraLogoProps {
  variant?: LogoVariant;
}

const AventraLogo = ({ variant = "Long" }: AventraLogoProps) => {
  if (variant === "Short") {
    return (
      <div className="flex items-center gap-0">
        <Image
          src="/images/aventra-logo.png"
          alt="Aventra Logo"
          width={50}
          height={50}
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-end">
      <div className=" flex items-center gap-0">
        <Image
          src="/images/aventra-logo.png"
          alt="Aventra Logo"
          width={50}
          height={50}
        />
        <h1 className="font-montserrat font-bold text-3xl leading-none">
          ventra
        </h1>
      </div>
      <p className="font-lato text-sm leading-none -mt-1">Accounting</p>
    </div>
  );
};

export default AventraLogo;

import AventraLogo from "@/shared/components/ui/aventra-logo";
import ShowcaseHeaderProfile from "../components/showcase-header-profile";

const ShowcaseHeader = () => {
  return (
    <header className="fixed w-full flex items-center justify-between bg-background px-6 py-4 dark:shadow-xl dark:shadow-black/30 shadow-[0_0_16px_rgba(240,88,3,0.20)]">
      <AventraLogo />
      <ShowcaseHeaderProfile />
    </header>
  );
};

export default ShowcaseHeader;

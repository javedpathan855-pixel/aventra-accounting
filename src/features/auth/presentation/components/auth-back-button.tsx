import { ArrowLeft } from "lucide-react";

import Button from "@/shared/components/ui/button";

interface AuthBackButtonProps {
  onClick: () => void;
  label?: string;
}

const AuthBackButton = ({ onClick, label = "Back" }: AuthBackButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="group  text-muted hover:border-primary/40 hover:bg-primary-muted hover:text-primary"
    >
      <ArrowLeft
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      {label}
    </Button>
  );
};

export default AuthBackButton;

import type { ReactNode } from "react";

import Card from "@/shared/components/ui/card";
import cn from "@/shared/utils/cn";

interface ProfileSectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

/**
 * Business-profile section card: title, muted description, then fields.
 * Keeps every General/Branding section visually consistent without a
 * second card system.
 */
const ProfileSectionCard = ({
  title,
  description,
  children,
  className,
}: ProfileSectionCardProps) => {
  return (
    <Card className={cn("flex min-w-0 flex-col gap-5 p-5 sm:p-6", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="font-montserrat text-base font-semibold text-foreground">
          {title}
        </h2>
        <p className="font-lato text-sm text-muted">{description}</p>
      </div>
      {children}
    </Card>
  );
};

export default ProfileSectionCard;

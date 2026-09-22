import Image from "next/image";
import type { ReactNode } from "react";

import cn from "@/shared/utils/cn";

interface IconBadgeProps {
  children: ReactNode;
  className?: string;
}

/** Peach rounded icon tile used across invoice panels. */
const IconBadge = ({ children, className }: IconBadgeProps) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-[10mm] w-[10mm] shrink-0 items-center justify-center rounded-[2.5mm] bg-primary-muted text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
};

interface InvoiceBrandProps {
  logoSizeMm?: number;
}

/** Seller lockup: logo mark + wordmark, matching the reference header. */
const InvoiceBrand = ({ logoSizeMm = 11 }: InvoiceBrandProps) => {
  const size = `${logoSizeMm}mm`;

  return (
    <div className="flex items-center gap-[3mm]">
      <Image
        src="/images/aventra-logo.png"
        alt="Aventra logo"
        width={48}
        height={48}
        style={{ width: size, height: size }}
      />
      <div className="flex flex-col leading-none">
        <span className="font-montserrat text-[19pt] font-bold text-foreground">
          Aventra
        </span>
        <span className="mt-[1mm] font-lato text-[10pt] text-muted">
          Accounting
        </span>
      </div>
    </div>
  );
};

/** Tagline lockup at the top-right of the invoice header. */
const InvoiceTagline = () => {
  return (
    <div className="flex items-center gap-[3mm]">
      <span aria-hidden="true" className="h-[0.7mm] w-[8mm] bg-primary" />
      <p className="text-right font-lato text-[10pt] leading-snug text-muted">
        Clear books.
        <br />
        Brighter business.
      </p>
    </div>
  );
};

export { IconBadge, InvoiceBrand, InvoiceTagline };

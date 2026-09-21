import Image from "next/image";

import type { InvoiceData } from "../../domain/invoice";

/** Bottom brand rule with tagline and website. */
const InvoiceFooter = ({ invoice }: { invoice: InvoiceData }) => {
  return (
    <div className="mt-auto flex items-end justify-between gap-[4mm] border-t border-subtle pt-[4mm]">
      <div className="flex items-center gap-[2.5mm]">
        <Image
          src="/images/aventra-logo.png"
          alt=""
          width={28}
          height={28}
          className="h-[7mm] w-[7mm]"
        />
        <div className="flex flex-col leading-tight">
          <p className="font-montserrat text-[9.5pt] font-bold text-foreground">
            Aventra Accounting
          </p>
          <p className="font-lato text-[8pt] text-muted">
            {invoice.footerTagline}
          </p>
        </div>
      </div>
      <p className="font-lato text-[8.5pt] text-muted">{invoice.website}</p>
    </div>
  );
};

export { InvoiceFooter };

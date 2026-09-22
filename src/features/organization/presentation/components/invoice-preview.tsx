import Image from "next/image";

import StatusBadge from "@/shared/components/ui/status-badge";
import cn from "@/shared/utils/cn";
import { formatINR } from "@/features/invoice/domain/invoice";

import ProfileSectionCard from "./profile-section-card";
import type { FontStyleValue, LayoutStyleValue } from "../business-profile-defaults";

interface InvoicePreviewProps {
  organizationName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: FontStyleValue;
  layoutStyle: LayoutStyleValue;
  logoUrl: string | null;
}

const SAMPLE_ROWS = [
  { id: "1", description: "Website Development", qty: 1, ratePaise: 5000000 },
  { id: "2", description: "Monthly Support", qty: 3, ratePaise: 500000 },
];

const SUBTOTAL_PAISE = 6500000;
const GST_PAISE = 1170000;
const TOTAL_PAISE = 7670000;

/**
 * Invoice Preview: static sample document (clearly badged) reflecting
 * live branding — logo, name, tagline, brand colors, font, and layout.
 * The hex values are organization data applied as inline styles to this
 * preview only; they never touch application styling.
 */
const InvoicePreview = ({
  organizationName,
  tagline,
  primaryColor,
  secondaryColor,
  fontStyle,
  layoutStyle,
  logoUrl,
}: InvoicePreviewProps) => {
  const classic = layoutStyle === "classic";
  const fontClass = fontStyle === "lato-classic" ? "font-lato" : "font-montserrat";

  return (
    <ProfileSectionCard
      title="Invoice Preview"
      description="See how your branding will appear on invoices."
    >
      <div className="flex items-center justify-between gap-2">
        <StatusBadge tone="neutral">Sample data</StatusBadge>
      </div>
      <div
        aria-label="Sample branded invoice preview"
        className={cn("flex min-w-0 flex-col gap-3 rounded-md border bg-surface-subtle p-4", classic ? "border-border" : "border-border-subtle")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
            ) : (
              <Image
                src="/images/aventra-logo.png"
                alt=""
                aria-hidden="true"
                width={36}
                height={36}
                className="shrink-0"
              />
            )}
            <div className="flex min-w-0 flex-col leading-tight">
              <p className={cn("truncate text-sm font-bold text-foreground", fontClass)}>
                {organizationName.trim() || "Your organization"}
              </p>
              {tagline.trim() ? (
                <p className="truncate font-lato text-[11px] text-muted">{tagline}</p>
              ) : null}
            </div>
          </div>
          <p
            className={cn("shrink-0 text-xs font-bold uppercase tracking-[0.2em]", fontClass)}
            style={{ color: primaryColor }}
          >
            Invoice
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between font-lato text-[11px] leading-relaxed">
          <div className="flex min-w-0 flex-col text-foreground">
            <span className="font-semibold">Bill To</span>
            <span className="font-semibold">Acme Corporation</span>
            <span className="text-muted">123 Business Street</span>
            <span className="text-muted">Bengaluru, Karnataka 560001</span>
            <span className="text-muted">India</span>
          </div>
          <dl className="grid shrink-0 grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-right max-[480px]:self-start">
            <dt className="text-muted">Invoice #</dt>
            <dd className="font-semibold text-foreground">INV-2024-001</dd>
            <dt className="text-muted">Date</dt>
            <dd className="text-foreground">Jan 15, 2024</dd>
            <dt className="text-muted">Due Date</dt>
            <dd className="text-foreground">Jan 30, 2024</dd>
          </dl>
        </div>

        <div className="min-w-0 w-full overflow-x-auto">
        <table className={cn("w-full font-lato text-[11px]", classic && "border-collapse")}>
          <caption className="sr-only">Sample invoice line items</caption>
          <thead>
            <tr
              className={cn(classic && "border-y border-border")}
              style={classic ? { color: secondaryColor } : undefined}
            >
              {["#", "Description", "Qty", "Rate", "Amount"].map((head, index) => (
                <th
                  key={head}
                  scope="col"
                  className={cn(
                    "py-1 font-semibold",
                    index === 0 && "w-6 text-left",
                    index === 1 && "text-left",
                    index > 1 && "text-right",
                    !classic && index === 0 && "text-muted",
                    !classic && index > 0 && "text-muted",
                  )}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-foreground">
            {SAMPLE_ROWS.map((row) => (
              <tr key={row.id} className={cn(classic && "border-b border-border-subtle")}>
                <td className="py-1">{row.id}</td>
                <td className="py-1">{row.description}</td>
                <td className="py-1 text-right">{row.qty}</td>
                <td className="py-1 text-right tabular-nums">{formatINR(row.ratePaise)}</td>
                <td className="py-1 text-right font-semibold tabular-nums">
                  {formatINR(row.ratePaise * row.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <dl className="ml-auto grid w-40 max-w-full grid-cols-2 gap-y-1 font-lato text-[11px]">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-right tabular-nums text-foreground">{formatINR(SUBTOTAL_PAISE)}</dd>
          <dt className="text-muted">GST (18%)</dt>
          <dd className="text-right tabular-nums text-foreground">{formatINR(GST_PAISE)}</dd>
          <div className="col-span-2 flex items-center justify-between rounded px-2 py-1 font-semibold" style={{ backgroundColor: `${primaryColor}14` }}>
            <dt>Total</dt>
            <dd className="tabular-nums" style={{ color: primaryColor }}>
              {formatINR(TOTAL_PAISE)}
            </dd>
          </div>
        </dl>
      </div>
    </ProfileSectionCard>
  );
};

export default InvoicePreview;

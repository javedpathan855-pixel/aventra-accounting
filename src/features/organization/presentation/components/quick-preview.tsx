import Image from "next/image";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

import ProfileSectionCard from "./profile-section-card";

interface QuickPreviewProps {
  organizationName: string;
  tagline: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  logoUrl: string | null;
}

/**
 * Quick Preview: live reflection of the General form on a compact
 * business-identity card. UI preview only — never persisted data.
 */
const QuickPreview = ({
  organizationName,
  tagline,
  email,
  phone,
  website,
  addressLines,
  logoUrl,
}: QuickPreviewProps) => {
  const rows = [
    { icon: Mail, label: "Email", value: email },
    { icon: Phone, label: "Phone", value: phone },
    { icon: Globe, label: "Website", value: website },
  ].filter((row) => row.value.trim() !== "");

  return (
    <ProfileSectionCard
      title="Quick Preview"
      description="How your business details will appear on invoices."
    >
      <div
        aria-label="Business identity preview"
        className="flex flex-col gap-4 rounded-md border border-border-subtle bg-surface-subtle p-4"
      >
        <div className="flex items-start gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" aria-hidden="true" className="h-11 w-11 shrink-0 object-contain" />
          ) : (
            <Image
              src="/images/aventra-logo.png"
              alt=""
              aria-hidden="true"
              width={44}
              height={44}
              className="shrink-0"
            />
          )}
          <div className="flex min-w-0 flex-col">
            <p className="truncate font-montserrat text-sm font-bold text-foreground">
              {organizationName.trim() || "Your organization"}
            </p>
            {tagline.trim() ? (
              <p className="truncate font-lato text-xs text-muted">{tagline}</p>
            ) : null}
          </div>
        </div>
        {rows.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {rows.map((row) => (
              <li key={row.label} className="flex min-w-0 items-center gap-2.5">
                <row.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="sr-only">{row.label}: </span>
                <span className="truncate font-lato text-xs text-foreground">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {addressLines.length > 0 ? (
          <div className="flex items-start gap-2.5">
            <MapPin aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="font-lato text-xs leading-relaxed text-foreground">
              <span className="sr-only">Registered address: </span>
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        ) : null}
      </div>
    </ProfileSectionCard>
  );
};

export default QuickPreview;

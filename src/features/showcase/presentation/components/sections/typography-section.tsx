import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const TYPE_SCALE = [
  {
    label: "Display",
    example: "₹48,500.00",
    className: "font-montserrat text-4xl font-bold text-foreground sm:text-5xl",
    usage: "Hero numerals, page display.",
  },
  {
    label: "Heading 1",
    example: "Invoices",
    className: "font-montserrat text-3xl font-bold text-foreground",
    usage: "Page titles.",
  },
  {
    label: "Heading 2",
    example: "Recent invoices",
    className: "font-montserrat text-2xl font-bold text-foreground",
    usage: "Section titles.",
  },
  {
    label: "Heading 3",
    example: "Billing details",
    className: "font-montserrat text-xl font-bold text-foreground",
    usage: "Card and pattern titles.",
  },
  {
    label: "Body",
    example: "Payment of ₹48,500.00 was received successfully.",
    className: "font-lato text-base text-muted",
    usage: "Descriptions, ledes, empty states.",
  },
  {
    label: "Body small",
    example: "INV-2048 · Due Friday · Nextgen Services",
    className: "font-lato text-sm text-muted",
    usage: "Metadata, table context, helper text.",
  },
  {
    label: "Label",
    example: "Business email",
    className: "font-montserrat text-sm font-medium text-foreground",
    usage: "Form labels, control names.",
  },
  {
    label: "Caption",
    example: "Recorded 2 hours ago · reconciled",
    className: "font-lato text-xs text-muted",
    usage: "Captions, timestamps, eyebrows context.",
  },
  {
    label: "Numeric",
    example: "₹1,24,000.00",
    className:
      "font-montserrat text-lg font-semibold tabular-nums text-foreground",
    usage: "Amounts, totals — semibold, tabular.",
  },
];

const TypographySection = () => {
  return (
    <ShowcaseSection
      eyebrow="Foundations"
      title="Typography"
      description="Montserrat carries display and brand voice; Lato carries body and data. The signature face is reserved for personal accents such as testimonials."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Scale in context</Subsection>
          <Preview>
            <dl className="flex flex-col gap-5">
              {TYPE_SCALE.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 border-b border-subtle pb-5 last:border-0 last:pb-0"
                >
                  <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                    {item.label} · {item.usage}
                  </dt>
                  <dd className={item.className}>{item.example}</dd>
                </div>
              ))}
            </dl>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Faces</Subsection>
          <Preview>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <p className="font-montserrat text-2xl font-bold text-foreground">
                  Montserrat
                </p>
                <p className="font-lato text-sm text-muted">
                  Display, headings, buttons, labels.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-lato text-2xl font-bold text-foreground">
                  Lato
                </p>
                <p className="font-lato text-sm text-muted">
                  Body copy, descriptions, financial detail.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-signature text-2xl text-foreground">
                  Signature
                </p>
                <p className="font-lato text-sm text-muted">
                  Personal accents only — never body text.
                </p>
              </div>
            </div>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default TypographySection;

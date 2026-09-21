import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import StatusBadge from "@/shared/components/ui/status-badge";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const InvoiceSummarySection = () => {
  return (
    <ShowcaseSection
      eyebrow="Patterns"
      title="Invoice Summary"
      description="Cards, typography, and status composed into a realistic financial summary. Primitives stay generic; meaning comes from arrangement."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Composition</Subsection>
        <Preview>
          <Card className="flex w-full max-w-md flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                  Invoice INV-2048
                </p>
                <p className="font-montserrat text-2xl font-bold text-foreground">
                  ₹48,500.00
                </p>
              </div>
              <StatusBadge tone="success">Paid</StatusBadge>
            </div>
            <Divider />
            <dl className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                  Billed to
                </dt>
                <dd className="font-lato text-sm text-foreground">
                  Nextgen Services
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                  Due date
                </dt>
                <dd className="font-lato text-sm text-foreground">Friday</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Record payment</Button>
              <Button variant="outline" size="sm">
                Download PDF
              </Button>
            </div>
          </Card>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default InvoiceSummarySection;

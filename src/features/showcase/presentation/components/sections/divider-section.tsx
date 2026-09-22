import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const DividerSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Divider"
      description="A single hairline for separating regions — horizontal, vertical, or labeled."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Orientations</Subsection>
        <Preview>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-montserrat text-sm font-semibold text-foreground">
                Billed this month
              </p>
              <Divider />
              <p className="font-lato text-sm text-muted">
                ₹1,24,000.00 across 6 invoices
              </p>
            </div>
            <Divider text="OR" />
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default DividerSection;

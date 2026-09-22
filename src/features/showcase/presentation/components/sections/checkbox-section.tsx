import Card from "@/shared/components/ui/card";
import Checkbox from "@/shared/components/ui/checkbox";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const CheckboxSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Checkbox"
      description="Binary consent and option toggles with animated check feedback. Fully keyboard operable; works controlled or uncontrolled."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>States</Subsection>
        <Preview>
          <div className="flex max-w-xl flex-col gap-4">
            <Checkbox
              id="showcase-terms"
              label="I agree to the Terms of Service and Privacy Policy"
            />
            <Checkbox
              id="showcase-invoice-copy"
              label="Email me a copy"
              description="A PDF receipt lands in your inbox after payment."
              defaultChecked
            />
            <Checkbox
              id="showcase-disabled-off"
              label="Auto-reconcile (disabled)"
              description="Unavailable on the current plan."
              disabled
            />
            <Checkbox
              id="showcase-disabled-on"
              label="Auto-reconcile (disabled, on)"
              disabled
              defaultChecked
            />
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default CheckboxSection;

import Card from "@/shared/components/ui/card";
import Select from "@/shared/components/ui/select";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const TAX_OPTIONS = [
  { label: "GST 18%", value: "gst-18" },
  { label: "GST 12%", value: "gst-12" },
  { label: "GST 5%", value: "gst-5" },
  { label: "Exempt", value: "exempt", disabled: true },
];

const SelectSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Select"
      description="Single-choice dropdown with full keyboard support — arrows move, Home/End jump, Enter selects, Escape closes. Controlled or uncontrolled."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>States</Subsection>
        <Preview>
          <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="showcase-tax"
              label="Tax rate"
              placeholder="Select tax rate"
              required
              options={TAX_OPTIONS}
            />
            <Select
              id="showcase-tax-selected"
              label="Preselected"
              defaultValue="gst-12"
              options={TAX_OPTIONS}
            />
            <Select
              id="showcase-tax-loading"
              label="Loading options"
              loading
              options={[]}
            />
            <Select
              id="showcase-tax-disabled"
              label="Disabled"
              disabled
              options={TAX_OPTIONS}
            />
            <Select
              id="showcase-tax-error"
              label="With validation error"
              error="Select a tax rate to continue."
              options={TAX_OPTIONS}
            />
            <Select
              id="showcase-tax-empty"
              label="No options"
              helperText="Options load from master data."
              options={[]}
            />
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default SelectSection;

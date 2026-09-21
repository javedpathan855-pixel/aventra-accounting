import Card from "@/shared/components/ui/card";
import Combobox from "@/shared/components/ui/combobox";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const CUSTOMER_OPTIONS = [
  { label: "ABC Enterprises", value: "abc" },
  { label: "Nextgen Services", value: "nextgen" },
  { label: "XYZ Industries", value: "xyz" },
  { label: "Archived Traders", value: "archived", disabled: true },
];

const ComboboxSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Combobox"
      description="Searchable single-select for long master lists — customers, products, ledgers. Type to filter, clear to reset."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>States</Subsection>
        <Preview>
          <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <Combobox
              id="showcase-customer"
              label="Customer"
              placeholder="Select customer"
              searchPlaceholder="Search customers…"
              options={CUSTOMER_OPTIONS}
            />
            <Combobox
              id="showcase-customer-selected"
              label="Preselected"
              defaultValue="nextgen"
              options={CUSTOMER_OPTIONS}
            />
            <Combobox
              id="showcase-customer-error"
              label="With validation error"
              error="Choose the billing customer."
              options={CUSTOMER_OPTIONS}
            />
            <Combobox
              id="showcase-customer-empty"
              label="No matches"
              noResultsText="No customers match this search."
              options={[]}
            />
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default ComboboxSection;

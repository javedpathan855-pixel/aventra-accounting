"use client";

import Card from "@/shared/components/ui/card";
import Combobox from "@/shared/components/ui/combobox";
import Select from "@/shared/components/ui/select";

const ShowcaseSelect = () => {
  return (
    <Card className="grid grid-cols-4 gap-4">
      <Select
        required
        label="Country"
        placeholder="Select Country"
        onChange={(value) => {
          console.log(value);
        }}
        options={[
          {
            label: "India",
            value: "india",
          },
          {
            label: "United States",
            value: "usa",
            disabled: true,
          },
          {
            label: "United Kingdom",
            value: "uk",
          },
        ]}
      />
      <Combobox
        id="customer"
        label="Customer"
        placeholder="Select customer"
        searchPlaceholder="Search customer..."
        options={[
          {
            label: "ABC Enterprises",
            value: "abc",
          },
          {
            label: "XYZ Industries",
            value: "xyz",
          },
          {
            label: "NextGen Services",
            value: "nextgen",
          },
        ]}
        onChange={(value) => {
          console.log(value);
        }}
      />
    </Card>
  );
};

export default ShowcaseSelect;

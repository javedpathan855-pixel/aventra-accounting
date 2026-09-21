"use client";

import { useState } from "react";
import { Printer } from "lucide-react";

import { InvoiceTemplate, type InvoiceTemplateId } from "@/features/invoice/presentation/invoice-template";
import { demoInvoice } from "@/features/invoice/presentation/demo-invoice";
import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const TEMPLATE_TABS: Array<{ id: InvoiceTemplateId; label: string }> = [
  { id: "default", label: "Default" },
  { id: "premium", label: "Premium" },
];

const InvoiceTemplatesSection = () => {
  const [template, setTemplate] = useState<InvoiceTemplateId>("premium");

  return (
    <ShowcaseSection
      eyebrow="Patterns"
      title="Invoice Templates"
      description="Production-ready A4 invoice templates designed for Aventra Accounting. Same canonical data, two presentations — rendered, printed, and exported from real markup."
      headerClassName="print:hidden"
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
        <div className="flex flex-col gap-3 print:hidden">
          <Subsection>Template</Subsection>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={template}
              onValueChange={(value) =>
                setTemplate(value as InvoiceTemplateId)
              }
            >
              <TabsList variant="underline" aria-label="Invoice template">
                {TEMPLATE_TABS.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="default">
                <span className="sr-only">Default template selected</span>
              </TabsContent>
              <TabsContent value="premium">
                <span className="sr-only">Premium template selected</span>
              </TabsContent>
            </Tabs>
            <Button onClick={() => window.print()}>
              <Printer aria-hidden="true" className="h-4 w-4" />
              Print Invoice
            </Button>
          </div>
        </div>
        <Divider className="print:hidden" />
        <div className="flex flex-col gap-3">
          <Subsection className="print:hidden">Live preview · A4</Subsection>
          <Preview className="overflow-x-auto bg-surface-muted p-4 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex">
              <div className="m-auto shrink-0">
                <InvoiceTemplate template={template} invoice={demoInvoice} />
              </div>
            </div>
          </Preview>
          <p className="font-lato text-sm text-muted print:hidden">
            The document keeps exact A4 proportions at every viewport — scroll
            horizontally on narrow screens instead of squishing. Print or save
            as PDF to verify the single-page result.
          </p>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default InvoiceTemplatesSection;

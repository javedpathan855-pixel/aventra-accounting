import { Plus } from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const PageHeaderSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Patterns"
      title="Page Header"
      description="The standard page opening: title, description, and actions in one row that wraps gracefully on mobile."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Composition</Subsection>
        <Preview>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="font-montserrat text-xl font-bold text-foreground">
                Invoices
              </h3>
              <p className="font-lato text-sm text-muted">
                Bill customers, track payments, and reconcile at month end.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">
                <Plus aria-hidden="true" className="h-4 w-4" />
                New invoice
              </Button>
            </div>
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default PageHeaderSection;

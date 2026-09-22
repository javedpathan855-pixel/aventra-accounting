import { ArrowRight, CircleCheck } from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const CardsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Cards"
      description="The quiet container primitive. Cards group related content — they never carry business logic themselves."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Compositions</Subsection>
          <Preview>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card className="flex flex-col gap-2">
                <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                  Invoice summary
                </p>
                <p className="font-montserrat text-2xl font-bold text-foreground">
                  ₹48,500.00
                </p>
                <p className="font-lato text-sm text-muted">
                  INV-2048 · Due Friday · Nextgen Services
                </p>
                <div className="mt-2">
                  <Button size="sm">Record payment</Button>
                </div>
              </Card>
              <Card className="flex flex-col gap-2">
                <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
                  Payment status
                </p>
                <p className="flex items-center gap-2 font-montserrat text-lg font-semibold text-success">
                  <CircleCheck aria-hidden="true" className="h-5 w-5" />
                  Paid in full
                </p>
                <p className="font-lato text-sm text-muted">
                  Receipt attached 2 hours ago.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View receipt
                  </Button>
                  <Button variant="link" size="sm">
                    Details
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Separation</Subsection>
          <Preview>
            <div className="flex flex-col gap-3">
              <p className="font-montserrat text-sm font-semibold text-foreground">
                Outstanding
              </p>
              <Divider />
              <p className="font-lato text-sm text-muted">
                Dividers separate card regions with a single hairline — never
                a second nested card.
              </p>
            </div>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default CardsSection;

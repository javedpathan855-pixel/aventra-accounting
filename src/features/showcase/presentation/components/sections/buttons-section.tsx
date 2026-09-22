import { ArrowRight, Plus } from "lucide-react";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import Spinner from "@/shared/components/ui/spinner";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const ButtonsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Buttons"
      description="Primary actions used throughout Aventra. Five variants, three sizes, full keyboard and disabled support. There is no loading prop — loading is composed with Spinner, never faked."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Variants</Subsection>
          <Preview>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Sizes & icons</Subsection>
          <Preview>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Record payment</Button>
              <Button size="md">
                <Plus aria-hidden="true" className="h-4 w-4" />
                New invoice
              </Button>
              <Button size="lg" variant="secondary">
                View report
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Disabled & loading pattern</Subsection>
          <Preview>
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Save draft</Button>
              <Button disabled>
                <Spinner size="sm" label="Saving invoice" />
                Saving invoice…
              </Button>
            </div>
            <p className="mt-4 font-lato text-sm text-muted">
              Loading composes a disabled Button with a Spinner — the action
              stays honest about being unavailable while work completes.
            </p>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default ButtonsSection;

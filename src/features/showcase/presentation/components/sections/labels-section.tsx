import Card from "@/shared/components/ui/card";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const LabelsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Labels"
      description="Every control gets a visible, associated label. Required state uses the error token asterisk, matching production forms."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Contexts</Subsection>
        <Preview>
          <div className="grid max-w-2xl grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-label-normal">Business name</Label>
              <Input
                id="showcase-label-normal"
                placeholder="Nextgen Services"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-label-required">
                GSTIN
                <span className="ml-1 text-error" aria-hidden="true">
                  *
                </span>
              </Label>
              <Input
                id="showcase-label-required"
                placeholder="22AAAAA0000A1Z5"
                aria-required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-label-disabled">Ledger code</Label>
              <Input
                id="showcase-label-disabled"
                placeholder="Auto-generated"
                disabled
              />
            </div>
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

const FieldErrorSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Field Error"
      description="The animated validation message. It appears with a calm fade, announces through role=alert, and associates via aria-describedby — never color alone."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Live message</Subsection>
        <Preview>
          <div className="flex max-w-sm flex-col gap-1">
            <Label htmlFor="showcase-field-error-demo">Email address</Label>
            <Input
              id="showcase-field-error-demo"
              type="email"
              defaultValue="accounts@"
              variant="error"
              aria-invalid
              aria-describedby="showcase-field-error-demo-error"
            />
            <FieldError
              id="showcase-field-error-demo-error"
              message="Enter a valid email address."
            />
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export { FieldErrorSection, LabelsSection };

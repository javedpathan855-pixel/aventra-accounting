import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import PasswordInput from "@/shared/components/ui/password-input";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const FormFieldsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Forms"
      title="Form Fields"
      description="The canonical field composition: label, control, helper or error. Every production form follows this exact stacking."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Composition</Subsection>
        <Preview>
          <div className="grid max-w-2xl grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-pattern-name">Full name</Label>
              <Input
                id="showcase-pattern-name"
                placeholder="Rahul Kumar"
                autoComplete="name"
              />
              <p className="font-lato text-xs text-muted">
                Helper text guides; error text replaces it on failure.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-pattern-password">Password</Label>
              <PasswordInput
                id="showcase-pattern-password"
                autoComplete="new-password"
                placeholder="Create a password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-pattern-gstin">GSTIN</Label>
              <Input
                id="showcase-pattern-gstin"
                placeholder="22AAAAA0000A1Z5"
                variant="error"
                aria-invalid
                aria-describedby="showcase-pattern-gstin-error"
              />
              <FieldError
                id="showcase-pattern-gstin-error"
                message="Enter a valid 15-character GSTIN."
              />
            </div>
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

const ValidationSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Forms"
      title="Validation"
      description="Validation runs through canonical Zod schemas at the boundary; the UI only renders the result. Auth forms demonstrate the full loop — labels, invalid states, associated messages, and clearing on correction."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Contract</Subsection>
        <Preview>
          <ul className="flex list-disc flex-col gap-1 pl-5 font-lato text-sm text-muted">
            <li>Schemas live in the Auth domain and validate once per submit.</li>
            <li>Field failures map to variant, aria-invalid, and FieldError.</li>
            <li>Editing a field clears its own error immediately.</li>
            <li>Client messages are UX only; the server stays authoritative.</li>
          </ul>
        </Preview>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Live contract demo</Subsection>
          <Preview>
            <div className="flex max-w-sm flex-col gap-1">
              <Label htmlFor="showcase-validation-email">
                Business email
              </Label>
              <Input
                id="showcase-validation-email"
                type="email"
                defaultValue="billing@"
                variant="error"
                aria-invalid
                aria-describedby="showcase-validation-email-error"
              />
              <FieldError
                id="showcase-validation-email-error"
                message="Enter a valid email address."
              />
            </div>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export { FormFieldsSection, ValidationSection };

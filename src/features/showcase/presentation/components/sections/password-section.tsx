import Card from "@/shared/components/ui/card";
import Label from "@/shared/components/ui/label";
import PasswordInput from "@/shared/components/ui/password-input";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const PasswordSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Password Input"
      description="Password entry with an independent visibility toggle per instance. Toggle the eye to feel the icon swap; validation and naming stay with the caller."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>States</Subsection>
        <Preview>
          <div className="grid max-w-2xl grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-password">Password</Label>
              <PasswordInput
                id="showcase-password"
                name="showcase-password"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="showcase-password-visible">
                Visible by default
              </Label>
              <PasswordInput
                id="showcase-password-visible"
                name="showcase-password-visible"
                autoComplete="current-password"
                defaultVisible
                placeholder="Enter your password"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="showcase-password-error">Invalid</Label>
                <PasswordInput
                  id="showcase-password-error"
                  name="showcase-password-error"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  variant="error"
                  aria-invalid
                  defaultValue="short"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="showcase-password-disabled">Disabled</Label>
                <PasswordInput
                  id="showcase-password-disabled"
                  name="showcase-password-disabled"
                  placeholder="Enter your password"
                  disabled
                />
              </div>
            </div>
          </div>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default PasswordSection;

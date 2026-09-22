"use client";

import { useState } from "react";
import { Mail, Search } from "lucide-react";

import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import FieldError from "@/shared/components/ui/field-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const InputsSection = () => {
  const [email, setEmail] = useState("accounts@");
  const emailError =
    email.length > 0 && !email.includes("@example.com")
      ? "Enter a valid email address."
      : undefined;

  return (
    <ShowcaseSection
      eyebrow="Components"
      title="Inputs"
      description="Text entry for business data. Variants signal state; prefix and suffix compose icons and controls without changing the input contract."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Variants</Subsection>
          <Preview>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input placeholder="Business name" />
              <Input placeholder="Error" variant="error" />
              <Input placeholder="Success" variant="success" />
              <Input placeholder="Warning" variant="warning" />
              <Input placeholder="Info" variant="info" />
              <Input placeholder="Disabled" disabled />
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Sizes & adornments</Subsection>
          <Preview>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                size="sm"
                placeholder="Invoice number"
                prefix={<Search aria-hidden="true" className="h-4 w-4" />}
              />
              <Input
                size="lg"
                placeholder="Amount"
                prefix={
                  <span aria-hidden="true" className="font-semibold">
                    ₹
                  </span>
                }
              />
            </div>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Live validation wiring</Subsection>
          <Preview>
            <div className="flex max-w-sm flex-col gap-1">
              <Label htmlFor="showcase-email">Email address</Label>
              <Input
                id="showcase-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                prefix={<Mail aria-hidden="true" className="h-4 w-4" />}
                variant={emailError ? "error" : "default"}
                aria-invalid={Boolean(emailError)}
                aria-describedby={
                  emailError ? "showcase-email-error" : undefined
                }
              />
              <FieldError id="showcase-email-error" message={emailError} />
            </div>
            <p className="mt-4 font-lato text-sm text-muted">
              Type to resolve the error — invalid state, message association,
              and clearing behave exactly as production forms do.
            </p>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default InputsSection;

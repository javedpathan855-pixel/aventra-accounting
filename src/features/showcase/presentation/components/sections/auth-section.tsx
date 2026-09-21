"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const AuthSection = () => {
  const router = useRouter();

  return (
    <ShowcaseSection
      eyebrow="Patterns"
      title="Auth Flow"
      description="Authentication lives in its own feature with validated forms, OTP, and themed presentation. This pattern links out instead of duplicating it."
    >
      <Card className="flex flex-col gap-6 p-6 sm:p-8">
        <Subsection>Entry point</Subsection>
        <Preview>
          <Card className="flex w-full max-w-md flex-col gap-3">
            <p className="flex items-center gap-2 font-montserrat text-sm font-semibold text-foreground">
              <LockKeyhole aria-hidden="true" className="h-4 w-4 text-primary" />
              Sign in to Aventra
            </p>
            <p className="font-lato text-sm text-muted">
              Validated login, registration with OTP verification, and
              password reset — all theme-aware and keyboard accessible.
            </p>
            <div>
              <Button size="sm" onClick={() => router.push("/auth")}>
                Open auth flow
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </Preview>
      </Card>
    </ShowcaseSection>
  );
};

export default AuthSection;

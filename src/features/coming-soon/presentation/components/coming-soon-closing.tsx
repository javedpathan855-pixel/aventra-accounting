"use client";

import { useRouter } from "next/navigation";

import AventraLogo from "@/shared/components/ui/aventra-logo";
import Button from "@/shared/components/ui/button";
import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";

import Reveal from "@/shared/animation/reveal";

interface ComingSoonClosingProps {
  authenticated: boolean;
}

const ComingSoonClosing = ({ authenticated }: ComingSoonClosingProps) => {
  const router = useRouter();

  const handleSecondary = () => {
    if (authenticated) {
      // Signed-in browsers bounce off /auth (proxy), so revisit the
      // roadmap instead of a dead-end navigation.
      document
        .getElementById("roadmap")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/auth");
  };

  return (
    <>
      <section
        aria-labelledby="closing-heading"
        className="mx-auto w-full px-4 py-16 sm:px-6 sm:py-20"
      >
        <Reveal>
          <Card className="flex flex-col items-center gap-5 px-6 py-12 text-center sm:px-12">
            <AventraLogo variant="Short" />
            <h2
              id="closing-heading"
              className="max-w-xl font-montserrat text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Ready when you are.
            </h2>
            <p className="max-w-xl font-lato text-base leading-relaxed text-muted">
              We&apos;re building Aventra Accounting to make everyday financial
              work simpler — one workflow at a time.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={() =>
                  router.push(authenticated ? "/dashboard" : "/auth")
                }
              >
                Enter Aventra
              </Button>
              <Button size="lg" variant="outline" onClick={handleSecondary}>
                {authenticated ? "Revisit the roadmap" : "Back to sign in"}
              </Button>
            </div>
          </Card>
        </Reveal>
      </section>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <Divider />
        <div className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
          <p className="font-montserrat text-sm font-semibold text-foreground">
            Aventra Accounting
          </p>
          <p className="font-lato text-sm text-muted">
            Built for better business workflows.
          </p>
        </div>
      </footer>
    </>
  );
};

export default ComingSoonClosing;

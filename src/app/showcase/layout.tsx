import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Aventra | Design System",
  description:
    "The Aventra Accounting design system — components, foundations, feedback states, and patterns.",
};

const ShowcaseLayout = ({ children }: { children: ReactNode }) => {
  return <div className="min-h-dvh bg-background">{children}</div>;
};

export default ShowcaseLayout;

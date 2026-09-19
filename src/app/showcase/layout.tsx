import ShowcaseHeader from "@/features/showcase/presentation/layout/showcase-header";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Aventra | Showcase",
  description:
    "Aventra is a professional accounting firm that provides a range of accounting services to businesses and individuals.",
};

const ShowcaseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-6">
      <ShowcaseHeader />
      <div className="">{children}</div>
    </div>
  );
};

export default ShowcaseLayout;

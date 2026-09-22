import Card from "@/shared/components/ui/card";
import Skeleton from "@/shared/components/ui/skeleton";

/**
 * Dashboard loading boundary. Mirrors the shell (sidebar rail, header,
 * greeting, preview cards, table) with shape-only placeholders so the
 * first paint lands without layout shift. No business data is faked —
 * every block is an aria-hidden skeleton announced once by the
 * surrounding status region.
 */
const DashboardLoading = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading your workspace"
      className="flex w-full flex-col gap-8 sm:gap-10"
    >
      <span className="sr-only">Loading your workspace…</span>
      <div aria-hidden="true" className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64 sm:h-9 sm:w-80" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <section aria-hidden="true" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="flex flex-col gap-2 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-28" />
          </Card>
          <Card className="flex flex-col gap-2 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-28" />
          </Card>
          <Card className="flex flex-col gap-2 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-28" />
          </Card>
        </div>
        <Card className="flex flex-col gap-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default DashboardLoading;

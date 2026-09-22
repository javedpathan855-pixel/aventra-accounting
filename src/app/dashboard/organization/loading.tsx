import Card from "@/shared/components/ui/card";
import Skeleton from "@/shared/components/ui/skeleton";

/**
 * Business-profile loading boundary. Shape-only placeholders mirroring
 * the header, tab strip, and section cards — no business data faked,
 * announced once by the surrounding status region.
 */
const OrganizationLoading = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading business profile"
      className="flex w-full min-w-0 flex-col gap-6"
    >
      <span className="sr-only">Loading business profile…</span>
      <div aria-hidden="true" className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div aria-hidden="true" className="flex gap-4 border-b border-border pb-2.5">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="hidden h-6 w-28 sm:block" />
      </div>
      <div aria-hidden="true" className="grid grid-cols-1 items-start gap-4 xl:grid-cols-5">
        <Card className="flex flex-col gap-3 p-5 xl:col-span-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-full max-w-xs" />
          <Skeleton className="h-28 w-28 rounded-md" />
        </Card>
        <Card className="flex flex-col gap-3 p-5 xl:col-span-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full max-w-sm" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationLoading;

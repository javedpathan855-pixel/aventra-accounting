import { Receipt } from "lucide-react";

import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import StatusBadge from "@/shared/components/ui/status-badge";

/**
 * Interface-driven glimpse of the future workspace. Purely decorative
 * composition from existing primitives — explicitly sample data, with
 * no live behavior behind it.
 */
const HeroVisual = () => {
  return (
    <figure aria-label="Preview of the future Aventra workspace" className="min-w-0">
      <Card className="flex min-w-0 flex-col gap-5 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
              Revenue · March
            </p>
            <p className="font-montserrat text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
              ₹4,82,500
            </p>
            <p className="font-lato text-sm text-muted">Collected across 28 invoices</p>
          </div>
          <StatusBadge tone="neutral">March</StatusBadge>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 320 88"
          className="h-22 w-full"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            d="M0,70 C30,64 45,48 70,52 C95,56 105,30 130,34 C155,38 165,58 190,54 C215,50 225,22 250,26 C275,30 295,12 320,16 L320,88 L0,88 Z"
            className="fill-primary-muted"
          />
          <path
            d="M0,70 C30,64 45,48 70,52 C95,56 105,30 130,34 C155,38 165,58 190,54 C215,50 225,22 250,26 C275,30 295,12 320,16"
            fill="none"
            className="stroke-primary"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <Divider />
        <dl className="grid grid-cols-2 gap-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
              Outstanding
            </dt>
            <dd className="font-montserrat text-xl font-bold tabular-nums text-foreground">
              ₹82,400
            </dd>
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <dt className="font-montserrat text-xs font-semibold uppercase tracking-widest text-muted">
              Expenses
            </dt>
            <dd className="font-montserrat text-xl font-bold tabular-nums text-foreground">
              ₹61,250
            </dd>
          </div>
        </dl>
        <div className="flex items-center gap-3 rounded-md bg-surface-muted px-4 py-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary"
          >
            <Receipt className="h-4 w-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate font-montserrat text-sm font-semibold text-foreground">
              INV-1048 · Acme Industries
            </p>
            <p className="font-lato text-xs text-muted">Due in 6 days</p>
          </div>
          <p className="shrink-0 font-montserrat text-sm font-bold tabular-nums text-foreground">
            ₹9,499
          </p>
        </div>
      </Card>
      <figcaption className="mt-3 text-center font-lato text-xs text-muted">
        A glimpse of the future workspace — sample data
      </figcaption>
    </figure>
  );
};

export default HeroVisual;

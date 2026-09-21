import { FileText, Headset, Laptop, Settings, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import cn from "@/shared/utils/cn";
import {
  formatINR,
  lineTotalPaise,
  type InvoiceData,
} from "../../domain/invoice";
import { IconBadge } from "./invoice-brand";
import type { InvoicePanelTone } from "./invoice-parties";

const ITEM_ICONS: Record<string, LucideIcon> = {
  "software-subscription": Laptop,
  "onboarding-setup": Settings,
  "user-license": Users,
  "priority-support": Headset,
};

const HEADERS = ["#", "Description", "Qty", "Unit Price", "Amount"] as const;

/** Itemized charges table. Real semantic table; print-safe hairlines. */
const InvoiceItemsTable = ({
  invoice,
  tone,
}: {
  invoice: InvoiceData;
} & { tone: InvoicePanelTone }) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[3mm]",
        tone === "premium" ? "bg-primary-muted/40" : "border border-subtle",
      )}
    >
      <table className="w-full border-collapse">
        <caption className="sr-only">
          Itemized charges for invoice {invoice.number}
        </caption>
        <thead>
          <tr
            className={cn(
              tone === "premium" ? "bg-primary-muted/70" : "border-b border-subtle",
            )}
          >
            {HEADERS.map((header, index) => (
              <th
                key={header}
                scope="col"
                className={cn(
                  "px-[3mm] py-[2mm] font-montserrat text-[8.5pt] font-semibold uppercase tracking-[0.14em] text-muted",
                  index === 0 && "w-[10mm] pl-[4mm] text-left",
                  index === 1 && "text-left",
                  index === 2 && "w-[16mm] text-center",
                  index > 2 && "text-right",
                  index === 4 && "pr-[4mm]",
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-surface">
          {invoice.items.map((item, index) => {
            const Icon = ITEM_ICONS[item.id] ?? FileText;

            return (
              <tr
                key={item.id}
                className="border-b border-subtle align-top last:border-b-0"
              >
                <td className="px-[3mm] py-[2mm] pl-[4mm] font-lato text-[9pt] text-muted">
                  {index + 1}
                </td>
                <td className="px-[3mm] py-[2mm]">
                  <div className="flex items-start gap-[3mm]">
                    <IconBadge className="h-[8mm] w-[8mm] rounded-[2mm]">
                      <Icon className="h-[4mm] w-[4mm]" strokeWidth={1.75} />
                    </IconBadge>
                    <div className="flex min-w-0 flex-col">
                      <span className="font-montserrat text-[9.5pt] font-semibold leading-snug text-foreground">
                        {item.title}
                      </span>
                      <span className="font-lato text-[8.5pt] text-muted">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-[3mm] py-[2mm] text-center font-lato text-[9pt] text-foreground">
                  {item.quantity}
                </td>
                <td className="whitespace-nowrap px-[3mm] py-[2mm] text-right font-lato text-[9pt] text-foreground">
                  {formatINR(item.unitPricePaise)}
                </td>
                <td className="whitespace-nowrap px-[3mm] py-[2mm] pr-[4mm] text-right font-montserrat text-[9.5pt] font-semibold text-foreground">
                  {formatINR(lineTotalPaise(item))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export { InvoiceItemsTable };

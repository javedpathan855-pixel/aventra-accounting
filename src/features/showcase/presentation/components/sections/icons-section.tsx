import {
  BellRing,
  CreditCard,
  Eye,
  FileText,
  Filter,
  Inbox,
  Landmark,
  LockKeyhole,
  Mail,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  SearchX,
  Users,
  Wallet,
} from "lucide-react";

import Card from "@/shared/components/ui/card";
import Divider from "@/shared/components/ui/divider";
import {
  Preview,
  ShowcaseSection,
  Subsection,
} from "../showcase-section";

const ICONS = [
  { icon: ReceiptText, name: "ReceiptText", context: "Invoices, bills" },
  { icon: Users, name: "Users", context: "Customers, teams" },
  { icon: Wallet, name: "Wallet", context: "Payments, balances" },
  { icon: Landmark, name: "Landmark", context: "Banks, institutions" },
  { icon: CreditCard, name: "CreditCard", context: "Cards, methods" },
  { icon: FileText, name: "FileText", context: "Documents, reports" },
  { icon: Search, name: "Search", context: "Search inputs" },
  { icon: SearchX, name: "SearchX", context: "No search results" },
  { icon: Filter, name: "Filter", context: "Filtering, toolbars" },
  { icon: Plus, name: "Plus", context: "Create actions" },
  { icon: RotateCcw, name: "RotateCcw", context: "Retry, reset" },
  { icon: Inbox, name: "Inbox", context: "Empty inboxes" },
  { icon: BellRing, name: "BellRing", context: "Notifications" },
  { icon: Mail, name: "Mail", context: "Email fields" },
  { icon: LockKeyhole, name: "LockKeyhole", context: "Password fields" },
  { icon: Eye, name: "Eye", context: "Visibility toggles" },
];

const IconsSection = () => {
  return (
    <ShowcaseSection
      eyebrow="Foundations"
      title="Icons"
      description="Lucide product icons at a consistent 16px in-field scale. Decorative icons stay aria-hidden; interactive ones always carry an accessible name."
    >
      <Card className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <Subsection>Product icon set</Subsection>
          <Preview>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ICONS.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-md border border-subtle bg-background p-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-muted text-muted"
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-montserrat text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="truncate font-lato text-xs text-muted">
                      {item.context}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Preview>
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <Subsection>Guidance</Subsection>
          <Preview>
            <ul className="flex list-disc flex-col gap-1 pl-5 font-lato text-sm text-muted">
              <li>
                One size in context — 16px inside inputs, 20px in theme
                controls.
              </li>
              <li>Icons never replace labels; they support them.</li>
              <li>
                Use the muted token for decorative icons, primary for active
                states.
              </li>
            </ul>
          </Preview>
        </div>
      </Card>
    </ShowcaseSection>
  );
};

export default IconsSection;

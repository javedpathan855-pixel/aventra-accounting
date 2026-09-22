// Coming Soon content model (presentation layer).
//
// Typed configuration rendered by reusable cards — changing a module
// from "coming-soon" to "available" is a data edit, never a UI rewrite.
// Statuses describe product truth only: nothing here implies an
// unimplemented workflow exists. Preview rows are explicitly sample
// data and must always be labeled as such at the call site.

import {
  Building,
  ChartNoAxesCombined,
  CreditCard,
  FileText,
  KeyRound,
  Landmark,
  Layers,
  MailCheck,
  Package,
  Palette,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type ModuleStatus = "foundation-ready" | "in-development" | "coming-soon" | "planned";

const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  "foundation-ready": "Foundation Ready",
  "in-development": "In Development",
  "coming-soon": "Coming Soon",
  planned: "Planned",
};

type StatusTone = "success" | "warning" | "info" | "neutral";

const MODULE_STATUS_TONE: Record<ModuleStatus, StatusTone> = {
  "foundation-ready": "success",
  "in-development": "warning",
  "coming-soon": "info",
  planned: "neutral",
};

interface RoadmapModule {
  id: string;
  name: string;
  description: string;
  meta: string;
  icon: LucideIcon;
  status: ModuleStatus;
}

interface RoadmapGroup {
  id: string;
  title: string;
  description: string;
  modules: RoadmapModule[];
}

const ROADMAP_GROUPS: RoadmapGroup[] = [
  {
    id: "core-business",
    title: "Core business",
    description: "The everyday workflows of getting paid.",
    modules: [
      {
        id: "invoices",
        name: "Invoicing",
        description: "Create, customize, and print professional invoices.",
        meta: "Financial workflow",
        icon: Receipt,
        status: "coming-soon",
      },
      {
        id: "customers",
        name: "Customers",
        description: "Keep every customer and balance in one place.",
        meta: "Relationships",
        icon: Users,
        status: "coming-soon",
      },
      {
        id: "items",
        name: "Products & Services",
        description: "Items, services, pricing, and tax information.",
        meta: "Catalog",
        icon: Package,
        status: "coming-soon",
      },
      {
        id: "payments",
        name: "Payments",
        description: "Track received payments and outstanding balances.",
        meta: "Cash flow",
        icon: CreditCard,
        status: "coming-soon",
      },
    ],
  },
  {
    id: "financial-operations",
    title: "Financial operations",
    description: "What the numbers mean, and where money goes.",
    modules: [
      {
        id: "expenses",
        name: "Expenses",
        description: "Record and organize business expenses as they happen.",
        meta: "Spend",
        icon: Wallet,
        status: "coming-soon",
      },
      {
        id: "accounting",
        name: "Accounting",
        description: "Ledger-oriented records and accounting workflows.",
        meta: "Ledger",
        icon: Landmark,
        status: "coming-soon",
      },
      {
        id: "reports",
        name: "Reports",
        description: "Financial summaries that read clearly at a glance.",
        meta: "Insights",
        icon: ChartNoAxesCombined,
        status: "planned",
      },
    ],
  },
  {
    id: "compliance-organization",
    title: "Compliance & organization",
    description: "The structure around the numbers.",
    modules: [
      {
        id: "tax",
        name: "GST / Tax",
        description: "Tax-aware invoicing and reporting workflows.",
        meta: "Compliance",
        icon: FileText,
        status: "planned",
      },
      {
        id: "organization",
        name: "Organization",
        description: "Your workspace profile, members, and settings.",
        meta: "Workspace",
        icon: Building,
        status: "foundation-ready",
      },
      {
        id: "settings",
        name: "Settings",
        description: "Workspace preferences, defaults, and members.",
        meta: "Preferences",
        icon: Settings,
        status: "planned",
      },
    ],
  },
];

type PreviewTone = "success" | "warning" | "neutral";

interface PreviewInvoice {
  id: string;
  customer: string;
  amount: string;
  status: string;
  tone: PreviewTone;
}

const PREVIEW_INVOICES: PreviewInvoice[] = [
  { id: "INV-1048", customer: "Acme Industries", amount: "₹9,499.00", status: "Paid", tone: "success" },
  { id: "INV-1049", customer: "Nova Systems", amount: "₹12,390.00", status: "Pending", tone: "warning" },
  { id: "INV-1050", customer: "Zenith Traders", amount: "₹4,200.00", status: "Draft", tone: "neutral" },
];

interface PreviewCustomer {
  name: string;
  detail: string;
  balance: string;
}

const PREVIEW_CUSTOMERS: PreviewCustomer[] = [
  { name: "Acme Industries", detail: "4 invoices · Noida", balance: "₹32,140.00" },
  { name: "Nova Systems", detail: "2 invoices · Bengaluru", balance: "₹12,390.00" },
  { name: "Zenith Traders", detail: "1 invoice · Mumbai", balance: "₹4,200.00" },
];

interface PreviewReport {
  label: string;
  value: string;
  hint: string;
}

const PREVIEW_REPORTS: PreviewReport[] = [
  { label: "Collected in March", value: "₹4,82,500.00", hint: "Across 28 invoices" },
  { label: "Outstanding", value: "₹82,400.00", hint: "Due within 14 days" },
  { label: "Expenses in March", value: "₹61,250.00", hint: "Across 11 entries" },
];

interface ReadyItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

// Product truth only: what a user can rely on today, without
// implementation details (no providers, schemas, or vendors).
const READY_ITEMS: ReadyItem[] = [
  {
    icon: ShieldCheck,
    title: "Secure authentication",
    text: "Email and password sign-in with verified identities.",
  },
  {
    icon: MailCheck,
    title: "Email verification",
    text: "Six-digit codes that expire fast and work once.",
  },
  {
    icon: KeyRound,
    title: "Session management",
    text: "Stay signed in safely, sign out everywhere.",
  },
  {
    icon: Building,
    title: "Organization foundation",
    text: "Your workspace, with you as its owner.",
  },
  {
    icon: Palette,
    title: "Light, dark, system themes",
    text: "A consistent look in every mode.",
  },
  {
    icon: Layers,
    title: "Reusable design system",
    text: "The same primitives behind every screen.",
  },
];

export {
  MODULE_STATUS_LABEL,
  MODULE_STATUS_TONE,
  PREVIEW_CUSTOMERS,
  PREVIEW_INVOICES,
  PREVIEW_REPORTS,
  READY_ITEMS,
  ROADMAP_GROUPS,
};
export type {
  ModuleStatus,
  PreviewCustomer,
  PreviewInvoice,
  PreviewReport,
  ReadyItem,
  RoadmapGroup,
  RoadmapModule,
  StatusTone,
};

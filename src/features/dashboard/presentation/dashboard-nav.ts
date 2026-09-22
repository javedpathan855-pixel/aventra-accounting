import {
  Building,
  ChartNoAxesCombined,
  ChartColumn,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type DashboardNavStatus = "available" | "coming-soon";

interface DashboardNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  status: DashboardNavStatus;
  /** Real route for available items only — coming-soon items toast instead. */
  href?: string;
  /** Calm one-line notice shown when a coming-soon item is chosen. */
  notice?: string;
}

interface DashboardNavSection {
  id: string;
  label: string;
  items: DashboardNavItem[];
}

const DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        status: "available",
        href: "/dashboard",
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    items: [
      {
        id: "customers",
        label: "Customers",
        icon: Users,
        status: "coming-soon",
        notice: "Customer management is coming soon.",
      },
      {
        id: "products",
        label: "Products & Services",
        icon: Package,
        status: "coming-soon",
        notice: "Products and services are coming soon.",
      },
      {
        id: "invoices",
        label: "Invoices",
        icon: FileText,
        status: "coming-soon",
        notice: "Invoice management is coming soon.",
      },
      {
        id: "payments",
        label: "Payments",
        icon: CreditCard,
        status: "coming-soon",
        notice: "Payment tracking is coming soon.",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "expenses",
        label: "Expenses",
        icon: Wallet,
        status: "coming-soon",
        notice: "Expense tracking is coming soon.",
      },
      {
        id: "accounting",
        label: "Accounting",
        icon: ChartNoAxesCombined,
        status: "coming-soon",
        notice: "Accounting workflows are coming soon.",
      },
      {
        id: "reports",
        label: "Reports",
        icon: ChartColumn,
        status: "coming-soon",
        notice: "Financial reports are coming soon.",
      },
      {
        id: "tax",
        label: "GST / Tax",
        icon: Percent,
        status: "coming-soon",
        notice: "Tax workflows are coming soon.",
      },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    items: [
      {
        id: "organization",
        label: "Organization",
        icon: Building,
        status: "coming-soon",
        notice: "Organization settings are coming soon.",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        status: "coming-soon",
        notice: "Workspace settings are coming soon.",
      },
    ],
  },
];

/** Flat view for consumers that do not care about grouping. */
const DASHBOARD_NAV: DashboardNavItem[] = DASHBOARD_NAV_SECTIONS.flatMap(
  (section) => section.items,
);

export { DASHBOARD_NAV, DASHBOARD_NAV_SECTIONS };
export type { DashboardNavItem, DashboardNavSection, DashboardNavStatus };

import {
  ChartNoAxesCombined,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type DashboardNavStatus = "available" | "coming-soon" | "foundation";

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

const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    status: "available",
    href: "/dashboard",
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: Receipt,
    status: "coming-soon",
    notice: "Invoice management is coming soon.",
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    status: "coming-soon",
    notice: "Customer management is coming soon.",
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    status: "coming-soon",
    notice: "Payment tracking is coming soon.",
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: Wallet,
    status: "coming-soon",
    notice: "Expense tracking is coming soon.",
  },
  {
    id: "reports",
    label: "Reports",
    icon: ChartNoAxesCombined,
    status: "coming-soon",
    notice: "Financial reports are coming soon.",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    status: "coming-soon",
    notice: "Workspace settings are coming soon.",
  },
];

export { DASHBOARD_NAV };
export type { DashboardNavItem, DashboardNavStatus };

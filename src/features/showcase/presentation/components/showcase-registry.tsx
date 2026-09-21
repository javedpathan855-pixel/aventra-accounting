import type { ComponentType } from "react";

import AuthSection from "./sections/auth-section";
import { LogoSection, ThemeSection } from "./sections/brand-section";
import ButtonsSection from "./sections/buttons-section";
import CardsSection from "./sections/cards-section";
import CheckboxSection from "./sections/checkbox-section";
import ColorsSection from "./sections/colors-section";
import ComboboxSection from "./sections/combobox-section";
import DividerSection from "./sections/divider-section";
import EmptySection from "./sections/empty-section";
import ErrorSection from "./sections/error-section";
import { RadiusShadowsSection, SpacingSection } from "./sections/foundations-extra-section";
import { FieldErrorSection, LabelsSection } from "./sections/labels-section";
import { FormFieldsSection, ValidationSection } from "./sections/forms-section";
import IconsSection from "./sections/icons-section";
import InputsSection from "./sections/inputs-section";
import InvoiceTemplatesSection from "./sections/invoice-templates-section";
import InvoiceSummarySection from "./sections/invoice-summary-section";
import LoadingSection from "./sections/loading-section";
import MotionSection from "./sections/motion-section";
import OverviewSection from "./sections/overview-section";
import PageHeaderSection from "./sections/page-header-section";
import PasswordSection from "./sections/password-section";
import SearchSection from "./sections/search-section";
import SelectSection from "./sections/select-section";
import TableSection from "./sections/table-section";
import TabsSection from "./sections/tabs-section";
import ToastSection from "./sections/toast-section";
import DialogSection from "./sections/dialog-section";
import TypographySection from "./sections/typography-section";

export interface ShowcaseNavItem {
  id: string;
  title: string;
  description: string;
  Component: ComponentType<{ onNavigate: (sectionId: string) => void }>;
}

export interface ShowcaseNavGroup {
  label: string;
  items: ShowcaseNavItem[];
}

/**
 * Single navigation source of truth. Overview receives the navigator;
 * every other section ignores it. Counts on the overview page derive
 * from these arrays — never hardcoded.
 */
export const SHOWCASE_NAV: ShowcaseNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        id: "overview",
        title: "Overview",
        description: "What this system is and how to use it.",
        Component: OverviewSection,
      },
    ],
  },
  {
    label: "Foundations",
    items: [
      {
        id: "foundations-colors",
        title: "Colors",
        description: "Live semantic tokens.",
        Component: ColorsSection,
      },
      {
        id: "foundations-typography",
        title: "Typography",
        description: "Display, body, and accents.",
        Component: TypographySection,
      },
      {
        id: "foundations-spacing",
        title: "Spacing",
        description: "The 4-point rhythm.",
        Component: SpacingSection,
      },
      {
        id: "foundations-radius-shadows",
        title: "Radius & Shadows",
        description: "Elevation tokens.",
        Component: RadiusShadowsSection,
      },
      {
        id: "foundations-icons",
        title: "Icons",
        description: "Product icon language.",
        Component: IconsSection,
      },
      {
        id: "foundations-motion",
        title: "Motion",
        description: "Centralized tween system.",
        Component: MotionSection,
      },
    ],
  },
  {
    label: "Components",
    items: [
      {
        id: "components-buttons",
        title: "Buttons",
        description: "Actions in five variants.",
        Component: ButtonsSection,
      },
      {
        id: "components-inputs",
        title: "Inputs",
        description: "Text entry and states.",
        Component: InputsSection,
      },
      {
        id: "components-password",
        title: "Password Input",
        description: "Visibility toggle field.",
        Component: PasswordSection,
      },
      {
        id: "components-select",
        title: "Select",
        description: "Single-choice dropdown.",
        Component: SelectSection,
      },
      {
        id: "components-combobox",
        title: "Combobox",
        description: "Searchable selection.",
        Component: ComboboxSection,
      },
      {
        id: "components-checkbox",
        title: "Checkbox",
        description: "Binary toggles.",
        Component: CheckboxSection,
      },
      {
        id: "components-cards",
        title: "Cards",
        description: "Quiet containers.",
        Component: CardsSection,
      },
      {
        id: "components-table",
        title: "Table",
        description: "Readable financial data.",
        Component: TableSection,
      },
      {
        id: "components-tabs",
        title: "Tabs",
        description: "Related content switching.",
        Component: TabsSection,
      },
      {
        id: "components-toast",
        title: "Toast",
        description: "Transient notifications.",
        Component: ToastSection,
      },
      {
        id: "components-dialog",
        title: "Dialog",
        description: "Focused modal interaction.",
        Component: DialogSection,
      },
      {
        id: "components-divider",
        title: "Divider",
        description: "Hairline separation.",
        Component: DividerSection,
      },
      {
        id: "components-labels",
        title: "Labels",
        description: "Associated control names.",
        Component: LabelsSection,
      },
      {
        id: "components-field-error",
        title: "Field Error",
        description: "Animated validation message.",
        Component: FieldErrorSection,
      },
      {
        id: "components-logo",
        title: "Logo",
        description: "Brand lockups.",
        Component: LogoSection,
      },
      {
        id: "components-theme",
        title: "Theme",
        description: "Light, dark, system.",
        Component: ThemeSection,
      },
    ],
  },
  {
    label: "Forms",
    items: [
      {
        id: "forms-fields",
        title: "Form Fields",
        description: "Canonical field composition.",
        Component: FormFieldsSection,
      },
      {
        id: "forms-validation",
        title: "Validation",
        description: "Schema-driven error contract.",
        Component: ValidationSection,
      },
    ],
  },
  {
    label: "Feedback",
    items: [
      {
        id: "feedback-loading",
        title: "Loading",
        description: "Skeletons and spinners.",
        Component: LoadingSection,
      },
      {
        id: "feedback-empty",
        title: "Empty States",
        description: "Calm no-data compositions.",
        Component: EmptySection,
      },
      {
        id: "feedback-error",
        title: "Error States",
        description: "Calm failure compositions.",
        Component: ErrorSection,
      },
    ],
  },
  {
    label: "Patterns",
    items: [
      {
        id: "patterns-page-header",
        title: "Page Header",
        description: "Title, description, actions.",
        Component: PageHeaderSection,
      },
      {
        id: "patterns-invoice",
        title: "Invoice Summary",
        description: "Financial summary card.",
        Component: InvoiceSummarySection,
      },
      {
        id: "patterns-invoice-templates",
        title: "Invoice Templates",
        description: "Production-ready A4 invoice templates.",
        Component: InvoiceTemplatesSection,
      },
      {
        id: "patterns-search",
        title: "Search",
        description: "Filter with empty state.",
        Component: SearchSection,
      },
      {
        id: "patterns-auth",
        title: "Auth Flow",
        description: "Entry to authentication.",
        Component: AuthSection,
      },
    ],
  },
];

export const SHOWCASE_COUNTS = {
  components:
    SHOWCASE_NAV.find((group) => group.label === "Components")?.items.length ??
    0,
  foundations:
    SHOWCASE_NAV.find((group) => group.label === "Foundations")?.items
      .length ?? 0,
  patterns:
    SHOWCASE_NAV.find((group) => group.label === "Patterns")?.items.length ??
    0,
};

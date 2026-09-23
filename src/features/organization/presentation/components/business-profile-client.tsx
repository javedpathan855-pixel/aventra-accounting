"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  ChevronRight,
  Contact,
  House,
  LayoutGrid,
  PenTool,
  Receipt,
  Save,
  Settings,
} from "lucide-react";

import Button from "@/shared/components/ui/button";
import EmptyState from "@/shared/components/ui/empty-state";
import StatusBadge from "@/shared/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToasts } from "@/shared/components/ui/toast";
import cn from "@/shared/utils/cn";
import { toFieldErrors } from "@/shared/errors/validation";
import { BusinessProfileSchema } from "@/features/organization/domain/schemas/business-profile.schema";
import { updateBusinessProfileAction } from "@/features/organization/presentation/actions/business-profile-actions";

import type {
  BusinessProfileFormValues,
  FontStyleValue,
  LayoutStyleValue,
} from "../business-profile-defaults";
import BrandingTab from "./branding-tab";
import GeneralTab from "./general-tab";

interface BusinessProfileClientProps {
  initial: BusinessProfileFormValues;
}

const PROFILE_TABS = [
  { value: "general", label: "General", icon: LayoutGrid, soon: false },
  { value: "branding", label: "Branding", icon: PenTool, soon: false },
  { value: "contact", label: "Contact & Address", icon: Contact, soon: true },
  { value: "details", label: "Business Details", icon: Briefcase, soon: true },
  { value: "tax", label: "Tax & Compliance", icon: Receipt, soon: true },
  { value: "preferences", label: "Preferences", icon: Settings, soon: true },
] as const;

type ProfileTabValue = (typeof PROFILE_TABS)[number]["value"];

/**
 * Business Profile page: breadcrumb header, Save Changes, tabbed General
 * / Branding forms with live previews, and honest coming-soon panels for
 * the remaining tabs. Form state is local; persistence travels through
 * the tenant-scoped server action — never a client organizationId.
 */
const BusinessProfileClient = ({ initial }: BusinessProfileClientProps) => {
  const { toast } = useToasts();
  const [activeTab, setActiveTab] = useState<ProfileTabValue>("general");
  const [values, setValues] = useState<BusinessProfileFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof BusinessProfileFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) {
        return previous;
      }
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }
    const parsed = BusinessProfileSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      toast({ title: "Please check the highlighted fields and try again.", tone: "error" });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const result = await updateBusinessProfileAction(parsed.data);
      if (result.success) {
        toast({ title: "Business profile saved", tone: "success" });
        return;
      }
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        toast({ title: "Please check the highlighted fields and try again.", tone: "error" });
        return;
      }
      toast({ title: result.error.message, tone: "error" });
    } catch {
      toast({ title: "Something went wrong. Please try again.", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 font-lato text-sm text-muted">
          <li>
            <Link
              href="/dashboard/organization"
              className="inline-flex items-center gap-1.5 rounded-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <House aria-hidden="true" className="h-3.5 w-3.5" />
              Organization
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            {activeTab === "general" || activeTab === "branding" ? (
              <span aria-current="page" className="font-medium text-primary">
                Business Profile
              </span>
            ) : (
              <span>Business Profile</span>
            )}
          </li>
          {activeTab !== "general" ? (
            <>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <span aria-current="page" className="font-medium text-primary">
                  {PROFILE_TABS.find((tab) => tab.value === activeTab)?.label}
                </span>
              </li>
            </>
          ) : null}
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Organization
          </p>
          <h1 className="font-montserrat text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Business <span className="text-primary">Profile</span>
          </h1>
          <p className="max-w-2xl font-lato text-sm leading-relaxed text-muted sm:text-base">
            Manage your organization details, business information, branding, and
            preferences.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="shrink-0"
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProfileTabValue)} className="min-w-0">
        <TabsList variant="underline" className="w-full min-w-0 gap-1 sm:gap-4">
          {PROFILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.soon}
                title={tab.soon ? `${tab.label} is coming soon` : undefined}
                badge={tab.soon ? <StatusBadge tone="neutral" className="px-1.5 py-0 text-[10px]">Soon</StatusBadge> : undefined}
                icon={<Icon aria-hidden="true" />}
                className={cn(isActive && !tab.soon && "text-primary")}
              >
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="general" className="min-w-0">
          <GeneralTab
            values={values}
            errors={errors}
            logoUrl={logoUrl}
            onChange={handleChange}
            onLogoSelect={setLogoUrl}
            onLogoRemove={() => setLogoUrl(null)}
          />
        </TabsContent>

        <TabsContent value="branding" className="min-w-0">
          <BrandingTab
            values={values}
            errors={errors}
            logoUrl={logoUrl}
            faviconUrl={faviconUrl}
            onChange={handleChange}
            onFontStyleChange={(value: FontStyleValue) =>
              handleChange("fontStyle", value)
            }
            onLayoutStyleChange={(value: LayoutStyleValue) =>
              handleChange("layoutStyle", value)
            }
            onLogoSelect={setLogoUrl}
            onLogoRemove={() => setLogoUrl(null)}
            onFaviconSelect={setFaviconUrl}
            onFaviconRemove={() => setFaviconUrl(null)}
          />
        </TabsContent>

        {PROFILE_TABS.filter((tab) => tab.soon).map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsContent key={tab.value} value={tab.value} className="min-w-0">
              <EmptyState
                icon={<Icon aria-hidden="true" className="h-6 w-6" />}
                title={`${tab.label} is coming soon`}
                description="This section of the business profile is not available yet."
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default BusinessProfileClient;

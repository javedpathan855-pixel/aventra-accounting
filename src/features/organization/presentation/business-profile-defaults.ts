// Business-profile form defaults (presentation layer, pure).
//
// Maps the server profile row onto fully-controlled form strings
// (null → ""), filling branding fallbacks for the preview-first paint.
// Tested below; no framework or persistence imports.

import type { BusinessProfileData } from "../domain/repositories/business-profile-repository";

type FontStyleValue = "montserrat-modern" | "lato-classic";
type LayoutStyleValue = "modern" | "classic";

interface BusinessProfileFormValues {
  organizationName: string;
  businessType: string;
  industry: string;
  website: string;
  tagline: string;
  email: string;
  phone: string;
  altPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  primaryColor: string;
  secondaryColor: string;
  brandTagline: string;
  brandDescription: string;
  fontStyle: FontStyleValue;
  layoutStyle: LayoutStyleValue;
}

const DEFAULT_PRIMARY_COLOR = "#f05803";
const DEFAULT_SECONDARY_COLOR = "#171717";

const textOrEmpty = (value: string | null): string => value ?? "";

const asFontStyle = (value: string | null): FontStyleValue =>
  value === "lato-classic" ? "lato-classic" : "montserrat-modern";

const asLayoutStyle = (value: string | null): LayoutStyleValue =>
  value === "classic" ? "classic" : "modern";

const mapProfileToForm = (
  profile: BusinessProfileData | null,
): BusinessProfileFormValues => ({
  organizationName: profile?.organizationName ?? "",
  businessType: textOrEmpty(profile?.businessType ?? null),
  industry: textOrEmpty(profile?.industry ?? null),
  website: textOrEmpty(profile?.website ?? null),
  tagline: textOrEmpty(profile?.tagline ?? null),
  email: textOrEmpty(profile?.email ?? null),
  phone: textOrEmpty(profile?.phone ?? null),
  altPhone: textOrEmpty(profile?.altPhone ?? null),
  addressLine1: textOrEmpty(profile?.addressLine1 ?? null),
  addressLine2: textOrEmpty(profile?.addressLine2 ?? null),
  city: textOrEmpty(profile?.city ?? null),
  state: textOrEmpty(profile?.state ?? null),
  pinCode: textOrEmpty(profile?.pinCode ?? null),
  country: textOrEmpty(profile?.country ?? null),
  primaryColor: profile?.primaryColor ?? DEFAULT_PRIMARY_COLOR,
  secondaryColor: profile?.secondaryColor ?? DEFAULT_SECONDARY_COLOR,
  brandTagline: textOrEmpty(profile?.brandTagline ?? null),
  brandDescription: textOrEmpty(profile?.brandDescription ?? null),
  fontStyle: asFontStyle(profile?.fontStyle ?? null),
  layoutStyle: asLayoutStyle(profile?.layoutStyle ?? null),
});

export {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
  mapProfileToForm,
};
export type { BusinessProfileFormValues, FontStyleValue, LayoutStyleValue };

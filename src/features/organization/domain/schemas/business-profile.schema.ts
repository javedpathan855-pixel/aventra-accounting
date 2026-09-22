import { z } from "zod";

/**
 * Canonical Business Profile contract (Organization → Business Profile).
 *
 * One schema covers both the General and Branding tabs because the page
 * saves atomically with a single Save Changes action. Required markers
 * follow the reference layout: organization name/type, address core, and
 * brand colors are required; everything else validates only when
 * supplied. Pure and infrastructure-independent.
 */

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const PHONE_PATTERN = /^[+\d][\d\s-]{6,19}$/;
const PIN_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/;

const requiredText = (message: string, max: number) =>
  z.string(message).trim().min(1, message).max(max, `Must be ${max} characters or fewer`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer`)
    .optional()
    .transform((value) => (value === "" || value === undefined ? undefined : value));

const optionalEmailField = z
  .string()
  .trim()
  .max(254, "Enter a valid email address")
  .optional()
  .transform((value) => (value === "" || value === undefined ? undefined : value))
  .refine(
    (value) => value === undefined || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Enter a valid email address",
  );

const optionalWebsiteField = z
  .string()
  .trim()
  .max(2048, "Enter a valid URL")
  .optional()
  .transform((value) => (value === "" || value === undefined ? undefined : value))
  .refine(
    (value) => value === undefined || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value),
    "Enter a valid URL starting with http(s)://",
  );

const optionalPhoneField = (message: string) =>
  z
    .string()
    .trim()
    .max(24, message)
    .optional()
    .transform((value) => (value === "" || value === undefined ? undefined : value))
    .refine((value) => value === undefined || PHONE_PATTERN.test(value), message);

const hexColorField = (message: string) =>
  z
    .string(message)
    .trim()
    .refine((value) => HEX_COLOR_PATTERN.test(value), message);

const BusinessProfileSchema = z.object({
  // General — Organization Information
  organizationName: requiredText("Organization name is required", 120),
  businessType: requiredText("Business type is required", 80),
  industry: optionalText(80),
  website: optionalWebsiteField,
  tagline: optionalText(120),
  // General — Contact Information
  email: optionalEmailField,
  phone: optionalPhoneField("Enter a valid phone number"),
  altPhone: optionalPhoneField("Enter a valid phone number"),
  // General — Registered Address
  addressLine1: requiredText("Address line 1 is required", 160),
  addressLine2: optionalText(160),
  city: requiredText("City is required", 80),
  state: requiredText("State is required", 80),
  pinCode: z
    .string("PIN code is required")
    .trim()
    .min(1, "PIN code is required")
    .max(10, "Enter a valid PIN code")
    .refine((value) => PIN_CODE_PATTERN.test(value), "Enter a valid PIN code"),
  country: requiredText("Country is required", 80),
  // Branding — Brand Colors (organization branding data, never app CSS)
  primaryColor: hexColorField("Enter a valid hex color, e.g. #f05803"),
  secondaryColor: hexColorField("Enter a valid hex color, e.g. #171717"),
  // Branding — Brand Identity
  brandTagline: optionalText(120),
  brandDescription: optionalText(200),
  // Branding — Document Appearance
  fontStyle: z.enum(["montserrat-modern", "lato-classic"]),
  layoutStyle: z.enum(["modern", "classic"]),
});

type BusinessProfileInput = z.infer<typeof BusinessProfileSchema>;

export { BusinessProfileSchema, HEX_COLOR_PATTERN };
export type { BusinessProfileInput };

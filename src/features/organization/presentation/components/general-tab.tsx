"use client";

import { Building2, Link2, Mail, MapPin, Phone } from "lucide-react";

import Input from "@/shared/components/ui/input";
import Select from "@/shared/components/ui/select";
import { LOGO_CONSTRAINTS } from "@/features/organization/domain/services/upload-validation";

import type { BusinessProfileFormValues } from "../business-profile-defaults";
import { BUSINESS_TYPES, COUNTRIES, INDIAN_STATES, INDUSTRIES } from "../business-profile-options";
import { ProfileField } from "./profile-field";
import ProfileSectionCard from "./profile-section-card";
import LogoUploadField from "./logo-upload-field";
import QuickPreview from "./quick-preview";

interface GeneralTabProps {
  values: BusinessProfileFormValues;
  errors: Record<string, string>;
  logoUrl: string | null;
  onChange: (field: keyof BusinessProfileFormValues, value: string) => void;
  onLogoSelect: (previewUrl: string) => void;
  onLogoRemove: () => void;
}

const addressLinesOf = (values: BusinessProfileFormValues): string[] => {
  const lines: string[] = [];
  if (values.addressLine1.trim()) lines.push(values.addressLine1.trim());
  if (values.addressLine2.trim()) lines.push(values.addressLine2.trim());
  const cityStatePin = [values.city.trim(), values.state.trim(), values.pinCode.trim()]
    .filter(Boolean)
    .join(", ");
  if (cityStatePin) lines.push(cityStatePin);
  if (values.country.trim()) lines.push(values.country.trim());
  return lines;
};

/**
 * General tab: logo, organization/contact/address fields, and the live
 * Quick Preview. All controls are controlled by the page-level form
 * state; validation messages arrive via `errors`.
 */
const GeneralTab = ({ values, errors, logoUrl, onChange, onLogoSelect, onLogoRemove }: GeneralTabProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-5">
        <ProfileSectionCard
          title="Organization Logo"
          description="Upload your business logo. This will be used on invoices, reports, and documents."
          className="xl:col-span-2"
        >
          <LogoUploadField
            id="organization-logo"
            uploadLabel="Upload Logo"
            acceptText="PNG, JPG or SVG (max 2MB)"
            removeLabel="Remove Logo"
            constraints={LOGO_CONSTRAINTS}
            previewUrl={logoUrl}
            previewAlt="Selected organization logo preview"
            onSelect={(_file, previewUrl) => onLogoSelect(previewUrl)}
            onRemove={onLogoRemove}
          />
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Organization Information"
          description="Basic information about your business."
          className="xl:col-span-3"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ProfileField id="organizationName" label="Organization Name" required error={errors.organizationName}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.organizationName}
                  placeholder="Aventra Technologies Pvt. Ltd."
                  autoComplete="organization"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  onChange={(event) => onChange("organizationName", event.target.value)}
                />
              )}
            </ProfileField>
            <Select
              id="businessType"
              label="Business Type"
              required
              placeholder="Select business type"
              options={BUSINESS_TYPES}
              value={values.businessType}
              error={errors.businessType}
              onChange={(value) => onChange("businessType", value)}
            />
            <Select
              id="industry"
              label="Industry (Optional)"
              placeholder="Select industry"
              options={INDUSTRIES}
              value={values.industry}
              error={errors.industry}
              onChange={(value) => onChange("industry", value)}
            />
            <ProfileField id="website" label="Website" error={errors.website}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.website}
                  placeholder="https://www.aventra.app"
                  inputMode="url"
                  autoComplete="url"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  prefix={<Link2 aria-hidden="true" className="h-4 w-4" />}
                  onChange={(event) => onChange("website", event.target.value)}
                />
              )}
            </ProfileField>
            <ProfileField
              id="tagline"
              label="Tagline"
              optional
              helper="This will appear on your invoices and documents."
              error={errors.tagline}
              className="sm:col-span-2"
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.tagline}
                  placeholder="Simplify Today. Grow Tomorrow."
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  onChange={(event) => onChange("tagline", event.target.value)}
                />
              )}
            </ProfileField>
          </div>
        </ProfileSectionCard>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ProfileSectionCard
          title="Contact Information"
          description="Primary contact details for your business."
        >
          <div className="flex flex-col gap-4">
            <ProfileField id="email" label="Email" error={errors.email}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.email}
                  placeholder="business@aventra.app"
                  inputMode="email"
                  autoComplete="email"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  prefix={<Mail aria-hidden="true" className="h-4 w-4" />}
                  onChange={(event) => onChange("email", event.target.value)}
                />
              )}
            </ProfileField>
            <ProfileField id="phone" label="Phone" error={errors.phone}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.phone}
                  placeholder="+91 98765 43210"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  prefix={<Phone aria-hidden="true" className="h-4 w-4" />}
                  onChange={(event) => onChange("phone", event.target.value)}
                />
              )}
            </ProfileField>
            <ProfileField id="altPhone" label="Alternative Phone" optional error={errors.altPhone}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.altPhone}
                  placeholder="+91 98765 43211"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  prefix={<Phone aria-hidden="true" className="h-4 w-4" />}
                  onChange={(event) => onChange("altPhone", event.target.value)}
                />
              )}
            </ProfileField>
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Registered Address"
          description="Your official business address."
        >
          <div className="flex flex-col gap-4">
            <ProfileField id="addressLine1" label="Address Line 1" required error={errors.addressLine1}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.addressLine1}
                  placeholder="123 Business Park, Tech Hub"
                  autoComplete="street-address"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  prefix={<MapPin aria-hidden="true" className="h-4 w-4" />}
                  onChange={(event) => onChange("addressLine1", event.target.value)}
                />
              )}
            </ProfileField>
            <ProfileField id="addressLine2" label="Address Line 2" optional error={errors.addressLine2}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.addressLine2}
                  placeholder="8th Floor, Tower A"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  prefix={<MapPin aria-hidden="true" className="h-4 w-4" />}
                  onChange={(event) => onChange("addressLine2", event.target.value)}
                />
              )}
            </ProfileField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileField id="city" label="City" required error={errors.city}>
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    value={values.city}
                    placeholder="Bengaluru"
                    autoComplete="address-level2"
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    variant={invalid ? "error" : "default"}
                    prefix={<Building2 aria-hidden="true" className="h-4 w-4" />}
                    onChange={(event) => onChange("city", event.target.value)}
                  />
                )}
              </ProfileField>
              <Select
                id="state"
                label="State"
                required
                placeholder="Select state"
                options={INDIAN_STATES}
                value={values.state}
                error={errors.state}
                onChange={(value) => onChange("state", value)}
              />
              <ProfileField id="pinCode" label="PIN Code" required error={errors.pinCode}>
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    value={values.pinCode}
                    placeholder="560001"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    variant={invalid ? "error" : "default"}
                    prefix={<MapPin aria-hidden="true" className="h-4 w-4" />}
                    onChange={(event) => onChange("pinCode", event.target.value)}
                  />
                )}
              </ProfileField>
              <Select
                id="country"
                label="Country"
                required
                placeholder="Select country"
                options={COUNTRIES}
                value={values.country}
                error={errors.country}
                onChange={(value) => onChange("country", value)}
              />
            </div>
          </div>
        </ProfileSectionCard>

        <div className="min-w-0 md:col-span-2 xl:col-span-1">
          <QuickPreview
            organizationName={values.organizationName}
            tagline={values.tagline}
            email={values.email}
            phone={values.phone}
            website={values.website}
            addressLines={addressLinesOf(values)}
            logoUrl={logoUrl}
          />
        </div>
      </div>

      <div
        role="note"
        aria-label="Keep your business information up to date"
        className="flex items-start gap-3 rounded-md border border-info/20 bg-info-muted p-4"
      >
        <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-info font-montserrat text-xs font-bold text-info-foreground">
          i
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="font-montserrat text-sm font-semibold text-foreground">
            Keep your business information up to date
          </p>
          <p className="font-lato text-sm text-muted">
            This information will be used across your invoices, reports, and other
            business documents. Make sure all details are accurate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;

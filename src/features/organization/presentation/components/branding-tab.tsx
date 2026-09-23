"use client";

import Input from "@/shared/components/ui/input";
import Select from "@/shared/components/ui/select";
import {
  FAVICON_CONSTRAINTS,
  LOGO_CONSTRAINTS,
} from "@/features/organization/domain/services/upload-validation";

import type {
  BusinessProfileFormValues,
  FontStyleValue,
  LayoutStyleValue,
} from "../business-profile-defaults";
import { FONT_STYLES } from "../business-profile-options";
import { ProfileField, ProfileTextarea } from "./profile-field";
import ProfileSectionCard from "./profile-section-card";
import ColorField from "./color-field";
import InvoicePreview from "./invoice-preview";
import LayoutStylePicker from "./layout-style-picker";
import LogoUploadField from "./logo-upload-field";

interface BrandingTabProps {
  values: BusinessProfileFormValues;
  errors: Record<string, string>;
  logoUrl: string | null;
  faviconUrl: string | null;
  onChange: (field: keyof BusinessProfileFormValues, value: string) => void;
  onFontStyleChange: (value: FontStyleValue) => void;
  onLayoutStyleChange: (value: LayoutStyleValue) => void;
  onLogoSelect: (previewUrl: string) => void;
  onLogoRemove: () => void;
  onFaviconSelect: (previewUrl: string) => void;
  onFaviconRemove: () => void;
}

const BRAND_DESCRIPTION_MAX = 200;

/**
 * Branding tab: logos, brand colors, identity copy, document appearance,
 * and the live Invoice Preview. Shares LogoUploadField with General —
 * no duplicate upload logic.
 */
const BrandingTab = ({
  values,
  errors,
  logoUrl,
  faviconUrl,
  onChange,
  onFontStyleChange,
  onLayoutStyleChange,
  onLogoSelect,
  onLogoRemove,
  onFaviconSelect,
  onFaviconRemove,
}: BrandingTabProps) => {
  const descriptionLength = values.brandDescription.length;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ProfileSectionCard
          title="Primary Logo"
          description="This logo will be used on invoices, estimates, reports, and other documents."
        >
          <LogoUploadField
            id="primary-logo"
            uploadLabel="Upload Logo"
            acceptText="PNG, JPG or SVG (max 2MB)"
            recommendedText="Recommended: 400×400px (1:1)"
            removeLabel="Remove Logo"
            constraints={LOGO_CONSTRAINTS}
            previewUrl={logoUrl}
            previewAlt="Selected primary logo preview"
            onSelect={(_file, previewUrl) => onLogoSelect(previewUrl)}
            onRemove={onLogoRemove}
          />
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Favicon"
          description="Small icon used in browser tab and bookmarks."
        >
          <LogoUploadField
            id="favicon"
            uploadLabel="Upload Favicon"
            acceptText="PNG, ICO or SVG (max 1MB)"
            recommendedText="Recommended: 32×32px (1:1)"
            removeLabel="Remove Favicon"
            constraints={FAVICON_CONSTRAINTS}
            previewUrl={faviconUrl}
            previewAlt="Selected favicon preview"
            compact
            onSelect={(_file, previewUrl) => onFaviconSelect(previewUrl)}
            onRemove={onFaviconRemove}
          />
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Brand Colors"
          description="These colors will be used in your invoices and documents."
          className="md:col-span-2 xl:col-span-1"
        >
          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <ColorField
              id="primaryColor"
              label="Primary Color"
              helper="Used for headings, highlights and primary elements."
              value={values.primaryColor}
              error={errors.primaryColor}
              onChange={(value) => onChange("primaryColor", value)}
            />
            <ColorField
              id="secondaryColor"
              label="Secondary Color"
              helper="Used for text, borders and secondary elements."
              value={values.secondaryColor}
              error={errors.secondaryColor}
              onChange={(value) => onChange("secondaryColor", value)}
            />
          </div>
        </ProfileSectionCard>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <ProfileSectionCard
          title="Brand Identity"
          description="Define your brand personality and visual style."
        >
          <div className="flex flex-col gap-4">
            <ProfileField
              id="brandTagline"
              label="Brand Tagline"
              helper="Appears on invoices, quotations and other documents."
              error={errors.brandTagline}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={values.brandTagline}
                  placeholder="Simplify Today. Grow Tomorrow."
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  variant={invalid ? "error" : "default"}
                  onChange={(event) => onChange("brandTagline", event.target.value)}
                />
              )}
            </ProfileField>
            <ProfileField
              id="brandDescription"
              label="Brand Description"
              optional
              error={errors.brandDescription}
            >
              {({ id, describedBy, invalid }) => (
                <ProfileTextarea
                  id={id}
                  value={values.brandDescription}
                  maxLength={BRAND_DESCRIPTION_MAX}
                  placeholder="A modern accounting solution for growing businesses."
                  describedBy={describedBy}
                  invalid={invalid}
                  onChange={(value) => onChange("brandDescription", value)}
                />
              )}
            </ProfileField>
            <div className="flex items-center justify-between gap-2">
              <p className="font-lato text-xs text-muted">
                Used in business documents and profiles.
              </p>
              <p
                aria-live="polite"
                aria-label={`${descriptionLength} of ${BRAND_DESCRIPTION_MAX} characters used`}
                className="shrink-0 font-lato text-xs tabular-nums text-muted"
              >
                {descriptionLength}/{BRAND_DESCRIPTION_MAX}
              </p>
            </div>
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Document Appearance"
          description="Customize how your brand appears on documents."
        >
          <div className="flex flex-col gap-5">
            <Select
              id="fontStyle"
              label="Font Style"
              helperText="Used in invoices, estimates and reports."
              options={FONT_STYLES}
              value={values.fontStyle}
              error={errors.fontStyle}
              onChange={(value) =>
                onFontStyleChange(value as FontStyleValue)
              }
            />
            <LayoutStylePicker
              value={values.layoutStyle}
              onChange={onLayoutStyleChange}
            />
          </div>
        </ProfileSectionCard>

        <div className="min-w-0 md:col-span-2 2xl:col-span-1">
          <InvoicePreview
            organizationName={values.organizationName}
            tagline={values.brandTagline || values.tagline}
            primaryColor={values.primaryColor}
            secondaryColor={values.secondaryColor}
            fontStyle={values.fontStyle}
            layoutStyle={values.layoutStyle}
            logoUrl={logoUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandingTab;

// Business-profile option lists (presentation layer).
//
// UI option data only — the domain schema validates presence/shape, not
// membership in these lists, so option edits never invalidate stored
// profiles.

interface ProfileOption {
  label: string;
  value: string;
}

const BUSINESS_TYPES: ProfileOption[] = [
  { label: "Sole Proprietorship", value: "Sole Proprietorship" },
  { label: "Partnership", value: "Partnership" },
  { label: "Limited Liability Partnership", value: "Limited Liability Partnership" },
  { label: "Private Limited Company", value: "Private Limited Company" },
  { label: "Public Limited Company", value: "Public Limited Company" },
  { label: "One Person Company", value: "One Person Company" },
  { label: "Trust / NGO", value: "Trust / NGO" },
  { label: "Other", value: "Other" },
];

const INDUSTRIES: ProfileOption[] = [
  { label: "Information Technology", value: "Information Technology" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Retail & E-commerce", value: "Retail & E-commerce" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Financial Services", value: "Financial Services" },
  { label: "Education", value: "Education" },
  { label: "Hospitality", value: "Hospitality" },
  { label: "Construction", value: "Construction" },
  { label: "Logistics", value: "Logistics" },
  { label: "Professional Services", value: "Professional Services" },
  { label: "Other", value: "Other" },
];

const INDIAN_STATES: ProfileOption[] = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
].map((state) => ({ label: state, value: state }));

const COUNTRIES: ProfileOption[] = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Singapore", "United Arab Emirates", "Germany", "France", "Netherlands",
  "Japan", "South Africa", "Brazil", "Other",
].map((country) => ({ label: country, value: country }));

const FONT_STYLES: ProfileOption[] = [
  { label: "Montserrat (Modern)", value: "montserrat-modern" },
  { label: "Lato (Classic)", value: "lato-classic" },
];

export { BUSINESS_TYPES, COUNTRIES, FONT_STYLES, INDIAN_STATES, INDUSTRIES };
export type { ProfileOption };

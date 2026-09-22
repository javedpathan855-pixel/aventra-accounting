import { expect, test } from "@playwright/test";

import { fillOtp, register, uniqueEmail, waitForMail } from "./helpers";

/**
 * Organization → Business Profile. Registers a fresh tenant through the
 * UI, completes verification, then exercises the profile page against
 * the tenant-scoped server actions — no client-supplied organizationId
 * anywhere in the flow.
 */
const signInFreshTenant = async (
  page: import("@playwright/test").Page,
  request: import("@playwright/test").APIRequestContext,
  tag: string,
  organization: string,
) => {
  const email = uniqueEmail(tag);
  await register(page, {
    name: "E2E Owner",
    organization,
    email,
    password: "E2E-Password-1",
  });
  const mail = await waitForMail(request, email, "verification");
  await fillOtp(page, mail.otp as string);
  await page.waitForURL(/\/dashboard/);
};

test("business profile page renders General and Branding tabs", async ({
  page,
  request,
}) => {
  await signInFreshTenant(page, request, "org-tabs", "E2E Profile Co");

  await page.goto("/dashboard/organization");
  await expect(
    page.getByRole("heading", { name: /business profile/i }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "General" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Organization Logo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Quick Preview" }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Branding" }).click();
  await expect(page.getByRole("tab", { name: "Branding" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Primary Logo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Invoice Preview" }),
  ).toBeVisible();
});

test("save persists the profile and reload restores it", async ({
  page,
  request,
}) => {
  await signInFreshTenant(page, request, "org-save", "E2E Save Co");

  await page.goto("/dashboard/organization");
  await expect(
    page.getByRole("heading", { name: /business profile/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Business Type" }).click();
  await page.getByRole("option", { name: "Private Limited Company" }).click();
  await page.getByLabel("Address Line 1").fill("123 Business Park, Tech Hub");
  await page.getByLabel("City").fill("Bengaluru");
  await page.getByRole("button", { name: "State" }).click();
  await page.getByRole("option", { name: "Karnataka" }).click();
  await page.getByLabel("PIN Code").fill("560001");
  await page.getByRole("button", { name: "Country" }).click();
  await page.getByRole("option", { name: "India", exact: true }).click();

  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Business profile saved").first()).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Address Line 1")).toHaveValue(
    "123 Business Park, Tech Hub",
  );
  await expect(page.getByLabel("City")).toHaveValue("Bengaluru");
  await expect(page.getByLabel("PIN Code")).toHaveValue("560001");
});

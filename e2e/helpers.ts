import { expect, type Page, type APIRequestContext } from "@playwright/test";

interface TestMailboxMessage {
  type: "verification" | "password-reset" | "existing-account-notice";
  to: string;
  otp?: string;
  resetUrl?: string;
}

const uniqueEmail = (tag: string): string =>
  `e2e-${tag}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}@example.com`;

/** Fill the registration form and submit; lands on the OTP step. */
const register = async (
  page: Page,
  input: { name: string; organization: string; email: string; password: string },
): Promise<void> => {
  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign Up" }).click();
  // Wait out the form transition so fields target the register form,
  // not the outgoing login form.
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
  await page.getByLabel("Full Name").fill(input.name);
  await page.getByLabel("Organization").fill(input.organization);
  await page.getByLabel("Business Email").fill(input.email);
  await page.getByLabel("Password", { exact: true }).fill(input.password);
  await page.getByLabel("Confirm Password").fill(input.password);
  // The design-system checkbox hides the native input (sr-only); toggling
  // via its visible label matches real user interaction.
  await page.getByText(/terms of service/i).click();
  await page.getByRole("button", { name: "Register" }).click();
  await expect(
    page.getByRole("heading", { name: "Two-Step Verification" }),
  ).toBeVisible();
};

/** Read captured mail for an address from the env-gated test mailbox. */
const readMailbox = async (
  request: APIRequestContext,
  email: string,
): Promise<TestMailboxMessage[]> => {
  const response = await request.get(
    `/api/test/mail?email=${encodeURIComponent(email)}`,
  );
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body.data.messages as TestMailboxMessage[];
};

/** Poll the test mailbox until a message of the given type arrives. */
const waitForMail = async (
  request: APIRequestContext,
  email: string,
  type: TestMailboxMessage["type"],
): Promise<TestMailboxMessage> => {
  let last: TestMailboxMessage[] = [];
  await expect
    .poll(async () => {
      last = await readMailbox(request, email);
      return last.some((message) => message.type === type);
    })
    .toBe(true);
  const found = last.find((message) => message.type === type);
  if (!found) {
    throw new Error(`No ${type} mail captured for ${email}`);
  }
  return found;
};

/** Type the 6-digit code into the OTP boxes (auto-verifies when complete). */
const fillOtp = async (page: Page, otp: string): Promise<void> => {
  expect(otp).toMatch(/^\d{6}$/);
  for (let index = 0; index < 6; index += 1) {
    await page.getByLabel(`OTP digit ${index + 1}`).fill(otp[index] as string);
  }
};

/** Sign out through the sidebar account menu. */
const signOut = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: /account menu/i }).click();
  await page.getByRole("menuitem", { name: /sign out/i }).click();
  await page.waitForURL(/\/auth/);
};

export { fillOtp, readMailbox, register, signOut, uniqueEmail, waitForMail };
export type { TestMailboxMessage };

import { expect, test } from "@playwright/test";

import { fillOtp, register, signOut, uniqueEmail, waitForMail } from "./helpers";

/**
 * Critical authentication flows. Mail delivery is deterministic: the
 * env-gated test adapter captures OTPs/reset links readable via
 * `/api/test/mail` — no production Resend credentials involved.
 */
test("registration -> OTP verification -> authenticated dashboard", async ({
  page,
  request,
}) => {
  const email = uniqueEmail("register");
  await register(page, {
    name: "E2E Founder",
    organization: "E2E Ventures",
    email,
    password: "E2E-Password-1",
  });

  const mail = await waitForMail(request, email, "verification");
  await fillOtp(page, mail.otp as string);

  await page.waitForURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
  await expect(page.getByText("E2E Ventures").first()).toBeVisible();
});

test("login with verified credentials reaches the dashboard", async ({
  page,
  request,
}) => {
  const email = uniqueEmail("login");
  const password = "E2E-Password-1";
  await register(page, {
    name: "E2E Member",
    organization: "E2E Login Co",
    email,
    password,
  });
  const mail = await waitForMail(request, email, "verification");
  await fillOtp(page, mail.otp as string);
  await page.waitForURL(/\/dashboard/);
  await signOut(page);

  await page.goto("/auth");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
});

test("unverified login routes to the verification flow", async ({ page }) => {
  const email = uniqueEmail("unverified");
  await register(page, {
    name: "E2E Pending",
    organization: "E2E Pending Co",
    email,
    password: "E2E-Password-1",
  });

  // Leave the account unverified: back out to login and sign in again.
  await page.getByRole("button", { name: /back/i }).first().click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("E2E-Password-1");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(
    page.getByRole("heading", { name: "Two-Step Verification" }),
  ).toBeVisible();
});

test("wrong password fails with a generic error", async ({ page }) => {
  const email = uniqueEmail("wrongpass");
  await register(page, {
    name: "E2E Secure",
    organization: "E2E Secure Co",
    email,
    password: "E2E-Password-1",
  });

  await page.getByRole("button", { name: /back/i }).first().click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Totally-Wrong-99");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText(/incorrect/i)).toBeVisible();
});

test("forgot password -> reset -> old session revoked -> login again", async ({
  page,
  request,
}) => {
  const email = uniqueEmail("reset");
  const oldPassword = "E2E-Password-1";
  const newPassword = "E2E-Password-2";
  await register(page, {
    name: "E2E Reset",
    organization: "E2E Reset Co",
    email,
    password: oldPassword,
  });
  const verification = await waitForMail(request, email, "verification");
  await fillOtp(page, verification.otp as string);
  await page.waitForURL(/\/dashboard/);
  await signOut(page);

  await page.goto("/auth");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("heading", { name: "Forgot password?" }),
  ).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Send Reset Link" }).click();
  await expect(page.getByText(/check your inbox/i).first()).toBeVisible();

  const resetMail = await waitForMail(request, email, "password-reset");
  await page.goto(resetMail.resetUrl as string);
  await expect(
    page.getByRole("heading", { name: "Set a new password" }),
  ).toBeVisible();
  await page.getByLabel("New password", { exact: true }).fill(newPassword);
  await page.getByLabel("Confirm new password").fill(newPassword);
  await page.getByRole("button", { name: "Update password" }).click();
  // Success redirects to /auth (the toast is cosmetic and may not paint
  // before navigation unmounts it).
  await page.waitForURL(/\/auth$/);
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  // Old password no longer works; the new one signs in cleanly.
  await page.goto("/auth");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(oldPassword);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText(/incorrect/i)).toBeVisible();

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(newPassword);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
});

test("dashboard logout invalidates the session", async ({
  page,
  request,
}) => {
  const email = uniqueEmail("logout");
  await register(page, {
    name: "E2E Leaver",
    organization: "E2E Leaver Co",
    email,
    password: "E2E-Password-1",
  });
  const mail = await waitForMail(request, email, "verification");
  await fillOtp(page, mail.otp as string);
  await page.waitForURL(/\/dashboard/);

  await signOut(page);

  // The invalidated session no longer opens the workspace.
  await page.goto("/dashboard");
  await page.waitForURL(/\/auth/);
});

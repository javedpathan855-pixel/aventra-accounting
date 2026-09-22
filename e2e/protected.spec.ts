import { expect, test } from "@playwright/test";

import { fillOtp, register, uniqueEmail, waitForMail } from "./helpers";

/**
 * Protected-route enforcement. The proxy redirects signed-out visitors,
 * and server-side session checks (not hidden UI) guard the workspace.
 */
test("unauthenticated /dashboard redirects to /auth", async ({ page }) => {
  const response = await page.goto("/dashboard");
  await page.waitForURL(/\/auth/);
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

  // Production security headers ride every response.
  const headers = response?.headers() ?? {};
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toContain("max-age=31536000");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
});

test("authenticated user reaches /dashboard", async ({
  page,
  request,
  context,
}) => {
  const email = uniqueEmail("protected");
  await register(page, {
    name: "E2E Guarded",
    organization: "E2E Guarded Co",
    email,
    password: "E2E-Password-1",
  });
  const mail = await waitForMail(request, email, "verification");
  await fillOtp(page, mail.otp as string);

  await page.waitForURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
  // Server-rendered workspace carries the tenant identity.
  await expect(page.getByText("E2E Guarded Co").first()).toBeVisible();

  // Session cookies stay HttpOnly with a strict same-site posture —
  // never readable from client script.
  const sessionCookie = (await context.cookies()).find((cookie) =>
    cookie.name.includes("session_token"),
  );
  expect(sessionCookie).toBeTruthy();
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(["Lax", "Strict"]).toContain(sessionCookie?.sameSite);
});

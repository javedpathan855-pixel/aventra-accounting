import {
  buildExistingAccountNotice,
  buildPasswordResetEmail,
  buildVerificationEmail,
} from "@/features/auth/infrastructure/email/auth-email-templates";
import { getEnv } from "@/config/env";
import { AppError } from "@/shared/errors/app-error";
import { TestEmailService } from "./test-email-service";

import type {
  EmailService,
  PasswordResetEmailPayload,
  RegistrationNoticePayload,
  VerificationEmailPayload,
} from "./email-service";

/**
 * Resend-backed EmailService. The SDK client is created lazily so that
 * importing this module (e.g. in tests) never requires credentials or
 * network access. Vendor failures map to EMAIL_DELIVERY_ERROR without
 * leaking Resend internals to callers.
 */
class ResendEmailService implements EmailService {
  async sendVerificationEmail(payload: VerificationEmailPayload): Promise<void> {
    const { subject, html, text } = buildVerificationEmail(payload);
    await this.send({ to: payload.to, subject, html, text });
  }

  async sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void> {
    const { subject, html, text } = buildPasswordResetEmail(payload);
    await this.send({ to: payload.to, subject, html, text });
  }

  async sendExistingAccountNotice(payload: RegistrationNoticePayload): Promise<void> {
    const { subject, html, text } = buildExistingAccountNotice();
    await this.send({ to: payload.to, subject, html, text });
  }

  private async send(message: { to: string; subject: string; html: string; text: string }) {
    const env = getEnv();
    const { Resend } = await import("resend");
    const resend = new Resend(env.RESEND_API_KEY);

    let result: { error: unknown };
    try {
      result = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });
    } catch (error) {
      throw new AppError("EMAIL_DELIVERY_ERROR", { cause: error });
    }

    if (result.error) {
      throw new AppError("EMAIL_DELIVERY_ERROR", { cause: result.error });
    }
  }
}

let shared: EmailService | null = null;

/**
 * Server-only singleton behind the EmailService port. Production always
 * resolves Resend. When `E2E_TEST_MAIL=stub` (E2E/CI only, never
 * production), mail is captured by the in-memory test adapter so specs
 * can complete OTP/reset round-trips deterministically.
 */
const getEmailService = (): EmailService => {
  if (shared) {
    return shared;
  }
  if (process.env.E2E_TEST_MAIL === "stub") {
    shared = new TestEmailService();
    return shared;
  }
  shared = new ResendEmailService();
  return shared;
};

/** Test seam: drop the cached service between tests. */
const resetEmailServiceCache = (): void => {
  shared = null;
};

export { getEmailService, resetEmailServiceCache, ResendEmailService };

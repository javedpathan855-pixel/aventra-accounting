// Deterministic test-mail adapter for E2E (never production).
//
// Active only when `E2E_TEST_MAIL=stub`: sent mail is appended to a
// JSON-lines mailbox file that the env-gated `/api/test/mail` route
// exposes, so specs can complete OTP and password-reset round-trips
// without real delivery. File-backed (not module-global) because server
// actions and route handlers may run in separate module graphs — the
// filesystem is the shared ground. Production always uses Resend — see
// `getEmailService`.

import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type {
  EmailService,
  PasswordResetEmailPayload,
  RegistrationNoticePayload,
  VerificationEmailPayload,
} from "./email-service";

type TestMailType = "verification" | "password-reset" | "existing-account-notice";

interface TestMail {
  type: TestMailType;
  to: string;
  otp?: string;
  resetUrl?: string;
  sentAt: string;
}

/** Override with E2E_TEST_MAILBOX_FILE when parallel suites need isolation. */
const mailboxFile = (): string =>
  process.env.E2E_TEST_MAILBOX_FILE ?? join(tmpdir(), "aventra-e2e-mailbox.jsonl");

class TestEmailService implements EmailService {
  async sendVerificationEmail(payload: VerificationEmailPayload): Promise<void> {
    record({
      type: "verification",
      to: payload.to,
      otp: payload.otp,
      sentAt: new Date().toISOString(),
    });
  }

  async sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void> {
    record({
      type: "password-reset",
      to: payload.to,
      resetUrl: payload.resetUrl,
      sentAt: new Date().toISOString(),
    });
  }

  async sendExistingAccountNotice(payload: RegistrationNoticePayload): Promise<void> {
    record({
      type: "existing-account-notice",
      to: payload.to,
      sentAt: new Date().toISOString(),
    });
  }
}

const record = (message: TestMail): void => {
  appendFileSync(mailboxFile(), `${JSON.stringify(message)}\n`, "utf8");
};

/** Test seam: inspect captured mail (E2E mailbox route). */
const getTestOutbox = (): TestMail[] => {
  const file = mailboxFile();
  if (!existsSync(file)) {
    return [];
  }
  return readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as TestMail];
      } catch {
        return [];
      }
    });
};

/** Test seam: clear captured mail between flows. */
const resetTestOutbox = (): void => {
  writeFileSync(mailboxFile(), "", "utf8");
};

export { getTestOutbox, mailboxFile, resetTestOutbox, TestEmailService };
export type { TestMail, TestMailType };

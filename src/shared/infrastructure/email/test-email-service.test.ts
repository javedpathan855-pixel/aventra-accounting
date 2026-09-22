import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { ResendEmailService, getEmailService, resetEmailServiceCache } from "./resend-email-service";
import { TestEmailService, getTestOutbox, resetTestOutbox } from "./test-email-service";

const previousMailboxFile = process.env.E2E_TEST_MAILBOX_FILE;
const previousStub = process.env.E2E_TEST_MAIL;

afterEach(() => {
  if (previousMailboxFile === undefined) {
    delete process.env.E2E_TEST_MAILBOX_FILE;
  } else {
    process.env.E2E_TEST_MAILBOX_FILE = previousMailboxFile;
  }
  if (previousStub === undefined) {
    delete process.env.E2E_TEST_MAIL;
  } else {
    process.env.E2E_TEST_MAIL = previousStub;
  }
  resetEmailServiceCache();
});

describe("test mail adapter", () => {
  it("captures verification mail and resets the outbox", async () => {
    process.env.E2E_TEST_MAILBOX_FILE = join(mkdtempSync(join(tmpdir(), "aventra-mailbox-")), "mail.jsonl");

    const service = new TestEmailService();
    await service.sendVerificationEmail({ to: " founder@example.com ".trim(), otp: "482913", expiresInMinutes: 10 });

    const messages = getTestOutbox();
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({ type: "verification", to: "founder@example.com", otp: "482913" });

    resetTestOutbox();
    expect(getTestOutbox()).toHaveLength(0);
  });

  it("resolves the stub only when E2E_TEST_MAIL=stub", () => {
    process.env.E2E_TEST_MAILBOX_FILE = join(mkdtempSync(join(tmpdir(), "aventra-mailbox-")), "mail.jsonl");

    process.env.E2E_TEST_MAIL = "stub";
    resetEmailServiceCache();
    expect(getEmailService()).toBeInstanceOf(TestEmailService);

    delete process.env.E2E_TEST_MAIL;
    resetEmailServiceCache();
    expect(getEmailService()).toBeInstanceOf(ResendEmailService);
  });
});

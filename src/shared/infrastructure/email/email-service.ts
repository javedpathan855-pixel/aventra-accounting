// Vendor-neutral email port. Application code depends on this
// interface; only the Resend adapter imports the vendor SDK, and only
// on the server. Payloads carry the minimum data the template needs.

interface VerificationEmailPayload {
  to: string;
  otp: string;
  expiresInMinutes: number;
}

interface PasswordResetEmailPayload {
  to: string;
  userName: string;
  resetUrl: string;
  expiresInMinutes: number;
}

interface RegistrationNoticePayload {
  to: string;
}

interface EmailService {
  sendVerificationEmail(payload: VerificationEmailPayload): Promise<void>;
  sendPasswordResetEmail(payload: PasswordResetEmailPayload): Promise<void>;
  sendExistingAccountNotice(payload: RegistrationNoticePayload): Promise<void>;
}

export type {
  EmailService,
  PasswordResetEmailPayload,
  RegistrationNoticePayload,
  VerificationEmailPayload,
};

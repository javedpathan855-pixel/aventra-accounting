// Aventra-branded auth email templates (pure functions, no I/O).
//
// Table-based layout for client compatibility, inline styles only, no
// external assets. Templates carry the minimum: brand, purpose, code or
// link, expiry, and a security notice. Never include internal IDs,
// database details, or implementation specifics.

import type {
  PasswordResetEmailPayload,
  VerificationEmailPayload,
} from "@/shared/infrastructure/email/email-service";

interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

const BRAND = "Aventra Accounting";
const ACCENT = "#f05803";
const INK = "#171717";
const MUTED = "#666360";
const PANEL = "#fff2eb";
const BORDER = "#eeeae7";

const shell = (heading: string, body: string): string => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f7f7f7;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:${INK};">Aventra</p>
                <p style="margin:4px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">${BRAND}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 0 32px;">
                <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:${INK};">${heading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 32px 0 32px;">${body}</td>
            </tr>
            <tr>
              <td style="padding:24px 32px 28px 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">If you did not request this, you can safely ignore this email. Never share verification codes or reset links with anyone — Aventra will never ask for them.</p>
              </td>
            </tr>
          </table>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${MUTED};">© Aventra Accounting · Modern Accounting for Modern Businesses</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const paragraph = (text: string): string =>
  `<p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${INK};">${text}</p>`;

const buildVerificationEmail = (payload: VerificationEmailPayload): BuiltEmail => {
  const subject = "Verify your Aventra account";
  const body = `${paragraph("Use the code below to verify your email address and finish creating your account.")}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 16px 0;background-color:${PANEL};border:1px solid ${BORDER};border-radius:8px;">
  <tr>
    <td style="padding:16px 28px;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:bold;letter-spacing:8px;color:${ACCENT};">${payload.otp}</td>
  </tr>
</table>
${paragraph(`This code expires in ${payload.expiresInMinutes} minutes and can be used only once.`)}`;

  return {
    subject,
    html: shell("Verify your email", body),
    text: `Aventra — verify your email\n\nYour verification code is ${payload.otp}. It expires in ${payload.expiresInMinutes} minutes and can be used only once.\n\nIf you did not request this, you can safely ignore this email.`,
  };
};

const buildPasswordResetEmail = (payload: PasswordResetEmailPayload): BuiltEmail => {
  const subject = "Reset your Aventra password";
  const body = `${paragraph(`Hi ${payload.userName}, use the button below to set a new password for your Aventra account.`)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 16px 0;">
  <tr>
    <td style="background-color:${ACCENT};border-radius:8px;">
      <a href="${payload.resetUrl}" style="display:inline-block;padding:12px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">Reset password</a>
    </td>
  </tr>
</table>
${paragraph(`This link expires in ${payload.expiresInMinutes} minutes and can be used only once. If the button does not work, paste this address into your browser:<br>${payload.resetUrl}`)}`;

  return {
    subject,
    html: shell("Reset your password", body),
    text: `Aventra — reset your password\n\nHi ${payload.userName}, open this link to set a new password (expires in ${payload.expiresInMinutes} minutes, single use):\n${payload.resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
  };
};

const buildExistingAccountNotice = (): BuiltEmail => {
  const subject = "You already have an Aventra account";
  const body = paragraph(
    "Someone tried to register with this email address, but an account already exists for it. If that was you, please sign in instead. If it was not you, you can safely ignore this email.",
  );

  return {
    subject,
    html: shell("Account already exists", body),
    text: "Aventra — account already exists\n\nSomeone tried to register with this email address, but an account already exists for it. If that was you, please sign in instead.",
  };
};

export { buildExistingAccountNotice, buildPasswordResetEmail, buildVerificationEmail };
export type { BuiltEmail };

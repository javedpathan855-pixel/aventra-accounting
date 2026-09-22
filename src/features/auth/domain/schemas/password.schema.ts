import { z } from "zod";

/**
 * Canonical password rule (ADR 003): at least 8 characters, no
 * character-class requirements (NIST SP 800-63B guidance — length is
 * the control). Single source of truth shared by registration UX and
 * every server boundary that accepts a password.
 */
const passwordField = (label = "Password") =>
  z
    .string(`${label} is required`)
    .min(1, `${label} is required`)
    .min(8, `${label} must be at least 8 characters`);

export { passwordField };

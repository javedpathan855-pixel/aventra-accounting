// Structured security event logging (OBSERVABILITY_RULES.md).
//
// Emits JSON lines with safe context only. The type system enforces the
// boundary: event context accepts strings/numbers/booleans — never
// passwords, OTPs, tokens, cookies, or secrets. Callers must not pass
// them; there is no parameter that could carry them safely.

type SecurityEventType =
  | "registration_started"
  | "registration_completed"
  | "verification_requested"
  | "verification_succeeded"
  | "verification_failed"
  | "verification_rate_limited"
  | "login_succeeded"
  | "login_failed"
  | "logout"
  | "password_reset_requested"
  | "password_reset_completed"
  | "session_revoked";

type LogLevel = "INFO" | "WARN" | "ERROR";

interface SecurityEventContext {
  userId?: string;
  emailDomain?: string;
  organizationId?: string;
  reason?: string;
}

const isSafeContextValue = (value: unknown): value is string | number | boolean =>
  typeof value === "string" || typeof value === "number" || typeof value === "boolean";

interface LogRecord {
  level: LogLevel;
  event: SecurityEventType;
  timestamp: string;
  context: Record<string, string | number | boolean>;
}

const emit = (level: LogLevel, event: SecurityEventType, context: SecurityEventContext = {}) => {
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(context)) {
    if (value !== undefined && isSafeContextValue(value)) {
      safe[key] = value;
    }
  }

  const record: LogRecord = {
    level,
    event,
    timestamp: new Date().toISOString(),
    context: safe,
  };

  const line = JSON.stringify(record);
  if (level === "ERROR") {
    console.error(line);
  } else if (level === "WARN") {
    console.warn(line);
  } else {
    console.info(line);
  }
};

/** Extract the domain only — full emails stay out of logs. */
const emailDomainOf = (email: string): string => {
  const at = email.lastIndexOf("@");
  return at >= 0 ? email.slice(at + 1).toLowerCase() : "invalid";
};

const logSecurityEvent = (
  event: SecurityEventType,
  context?: SecurityEventContext,
) => {
  const level: LogLevel =
    event.endsWith("_failed") || event === "verification_rate_limited" ? "WARN" : "INFO";
  emit(level, event, context);
};

export { emailDomainOf, logSecurityEvent };
export type { LogLevel, SecurityEventContext, SecurityEventType };

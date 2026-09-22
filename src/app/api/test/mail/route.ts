import { NextResponse } from "next/server";

import { AppError, toErrorEnvelope, toSuccessEnvelope } from "@/shared/errors/app-error";
import { getTestOutbox } from "@/shared/infrastructure/email/test-email-service";

/**
 * E2E test mailbox. Env-gated: unless `E2E_TEST_MAIL=stub` this route
 * behaves as 404, so production exposes nothing. With the stub active,
 * specs read captured OTPs/reset URLs to complete auth round-trips
 * deterministically without real delivery.
 */
export const dynamic = "force-dynamic";

const TestMailRouteEnabled = () => process.env.E2E_TEST_MAIL === "stub";

const GET = async (request: Request) => {
  if (!TestMailRouteEnabled()) {
    const { status, body } = toErrorEnvelope(new AppError("NOT_FOUND"));
    return NextResponse.json(body, { status });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const messages = getTestOutbox().filter((message) =>
    email ? message.to.toLowerCase() === email : true,
  );
  return NextResponse.json(toSuccessEnvelope({ messages }));
};

export { GET };

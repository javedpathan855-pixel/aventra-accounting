import { getAuth } from "@/features/auth/infrastructure/auth/auth";

// Better Auth owns these routes (sessions, credentials, OTP, reset,
// organization plugin endpoints). Thin transport only — no business
// logic here per API_RULES.md.
const handler = async (request: Request) => getAuth().handler(request);

export { handler as GET, handler as POST };

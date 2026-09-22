import { headers } from "next/headers";

/** Best-effort caller IP for rate-limit keys (not an auth decision). */
const getClientIp = async (): Promise<string> => {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  return headerList.get("x-real-ip")?.trim() || "unknown";
};

export { getClientIp };

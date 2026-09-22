// Pure upload validation for business-profile imagery (domain layer).
//
// Validates MIME type, file extension, and byte size without touching
// the DOM or storage. Both the client preview and (when asset storage
// lands) the server boundary must enforce the same constraints —
// client checks are UX only, never authorization.

interface UploadConstraints {
  /** Accepted MIME types, e.g. ["image/png", "image/jpeg", "image/svg+xml"]. */
  accept: string[];
  /** Maximum file size in bytes. */
  maxBytes: number;
}

interface UploadFileLike {
  type: string;
  size: number;
  name: string;
}

const MIME_TO_EXTENSIONS: Record<string, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/svg+xml": ["svg"],
  "image/x-icon": ["ico"],
  "image/vnd.microsoft.icon": ["ico"],
};

const LOGO_CONSTRAINTS: UploadConstraints = {
  accept: ["image/png", "image/jpeg", "image/svg+xml"],
  maxBytes: 2 * 1024 * 1024,
};

const FAVICON_CONSTRAINTS: UploadConstraints = {
  accept: ["image/png", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml"],
  maxBytes: 1 * 1024 * 1024,
};

const formatMaxSize = (maxBytes: number): string =>
  maxBytes >= 1024 * 1024 ? `${Math.round(maxBytes / (1024 * 1024))}MB` : `${Math.round(maxBytes / 1024)}KB`;

const extensionOf = (name: string): string => {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
};

/**
 * Validate an image file against constraints. Returns a human-readable
 * error message, or null when the file is acceptable.
 */
const validateImageFile = (
  file: UploadFileLike,
  constraints: UploadConstraints,
): string | null => {
  if (file.size > constraints.maxBytes) {
    return `File must be ${formatMaxSize(constraints.maxBytes)} or smaller`;
  }
  const allowedExtensions = constraints.accept.flatMap(
    (mime) => MIME_TO_EXTENSIONS[mime] ?? [],
  );
  const extension = extensionOf(file.name);
  const typeAllowed = constraints.accept.includes(file.type);
  const extensionAllowed = extension !== "" && allowedExtensions.includes(extension);
  if (!typeAllowed || !extensionAllowed) {
    return "Unsupported file type";
  }
  return null;
};

export {
  FAVICON_CONSTRAINTS,
  LOGO_CONSTRAINTS,
  formatMaxSize,
  validateImageFile,
};
export type { UploadConstraints, UploadFileLike };

/**
 * Initials fallback for user avatars. Trims whitespace and returns the
 * first visible character upper-cased, falling back to "A" for empty
 * names so every identity always renders a stable glyph.
 */
const avatarInitial = (userName: string): string =>
  userName.trim().charAt(0).toUpperCase() || "A";

export { avatarInitial };

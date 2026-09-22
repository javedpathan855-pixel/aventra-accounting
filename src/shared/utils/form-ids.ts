/**
 * Builds the stable error-element id for a form field.
 *
 * Keeps the field id → error id → aria-describedby contract in one place
 * so form code cannot drift out of sync (a mismatch fails silently for
 * assistive technology). Field ids in this project are static strings, so
 * no generated or random ids are needed.
 */
export const getFieldErrorId = (fieldId: string): string => `${fieldId}-error`;

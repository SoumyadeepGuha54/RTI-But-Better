/** Small formatting helpers. Kept pure so they are safe during SSR/first render. */

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "26 Aug 2026" */
export function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/** "26 Aug 2026 · 14:05" */
export function formatDateTime(date: Date): string {
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return `${formatDate(date)} · ${time}`;
}

/** "Just now", "12 min ago", "3 h ago", then falls back to a date. */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} d ago`;
  return formatDate(new Date(then));
}

/** Initials for the avatar, e.g. "Soumy Prakash" -> "SP". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Short code used inside registration numbers, e.g. "Ministry of Railways" -> "RAIL". */
export function authorityCode(name: string): string {
  const skip = new Set(["of", "and", "the", "for", "&"]);
  const words = name
    .split(/[\s,]+/)
    .filter((word) => word && !skip.has(word.toLowerCase()));
  const acronym = words
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return acronym.slice(0, 4) || "RTI";
}

export function randomDigits(length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) out += Math.floor(Math.random() * 10);
  return out;
}

/** RTI/2026/RAIL/482917 */
export function makeRegistration(authority: string, prefix = "RTI"): string {
  const year = new Date().getFullYear();
  return `${prefix}/${year}/${authorityCode(authority)}/${randomDigits(6)}`;
}

/** APL/2026/RAIL/2841 */
export function makeAppealReference(authority: string): string {
  const year = new Date().getFullYear();
  return `APL/${year}/${authorityCode(authority)}/${randomDigits(4)}`;
}

export function makeTransactionId(): string {
  return `DEMOTXN${randomDigits(8)}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Trim a long string for list display without cutting mid-word where possible. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Registration numbers contain slashes, which cannot go into a URL path
 * segment cleanly, so routes use a dashed form: RTI/2026/RAIL/482917
 * becomes RTI-2026-RAIL-482917. Compare with `matchesSlug` rather than
 * converting back, since that direction is ambiguous.
 */
export function toSlug(reference: string): string {
  return reference.replace(/\//g, "-");
}

export function matchesSlug(
  reference: string,
  slug: string | undefined,
): boolean {
  return (
    Boolean(slug) && toSlug(reference).toLowerCase() === slug!.toLowerCase()
  );
}

/** Mask an email for the public tracking screen: soumy@example.com -> s•••••@example.com */
export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 1)}${"•".repeat(Math.max(3, name.length - 1))}@${domain}`;
}

/** Mask a phone number, keeping the last four digits. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `${"•".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

/** Stable pseudo-random 0..1 from a string — used to draw a deterministic QR pattern. */
export function seededRandom(seed: string): () => number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return ((hash >>> 0) % 10000) / 10000;
  };
}

// Turns a stored contact link into a safe href for the public site.
// Accepts "name@example.com", "mailto:name@example.com", "+232 77 444888",
// "tel:+232...", and full http(s) URLs. Anything else gets no link, so
// unknown values and schemes like "javascript:" are never clickable.

export type ContactLinkKind = "email" | "phone" | "web";

export interface ContactLink {
  kind: ContactLinkKind | null;
  href: string | null;
  // Readable text for the link, e.g. the address or number.
  label: string;
}

const EMAIL = /^[^\s@:/]+@[^\s@:/]+\.[^\s@:/]+$/;
const PHONE = /^\+?[\d\s().-]{6,}$/;

export function getContactLink(rawLink: string): ContactLink {
  const link = rawLink.trim();
  const lower = link.toLowerCase();

  // Strip a scheme that is already there, so it is never doubled.
  const value = lower.startsWith("mailto:")
    ? link.slice("mailto:".length).trim()
    : lower.startsWith("tel:")
      ? link.slice("tel:".length).trim()
      : link;

  if (EMAIL.test(value)) {
    return { kind: "email", href: `mailto:${value}`, label: value };
  }

  if (PHONE.test(value) && /\d{6,}/.test(value.replace(/\D/g, ""))) {
    // Keep a leading "+", drop spaces and punctuation.
    const digits = value.replace(/(?!^\+)[^\d]/g, "");
    return { kind: "phone", href: `tel:${digits}`, label: value };
  }

  if (lower.startsWith("https://") || lower.startsWith("http://")) {
    try {
      const url = new URL(link);
      const path = url.pathname === "/" ? "" : url.pathname;
      return {
        kind: "web",
        href: url.href,
        label: `${url.hostname.replace(/^www\./, "")}${path}`,
      };
    } catch {
      // Not a valid URL; fall through to plain text.
    }
  }

  return { kind: null, href: null, label: link };
}

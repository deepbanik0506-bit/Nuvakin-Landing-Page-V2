export const site = {
  name: "Nuvakin",
  title: "Nuvakin — Better Decisions Start With Better Intelligence",
  description:
    "Nuvakin is building structured, evidence-backed intelligence to help people research, understand, compare and shortlist education options.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuvakin.com").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "office@nuvakin.com",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || null,
} as const;

export const navigation = [
  { label: "Intelligence", href: "/#intelligence" },
  { label: "Platform", href: "/#platform" },
  { label: "Products", href: "/#products" },
  { label: "About", href: "/#about" },
] as const;

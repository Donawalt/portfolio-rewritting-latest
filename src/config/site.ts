export const SITE_URL = "https://www.donaelwalter.com";

export const SOCIALS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/dona%C3%ABl-walter/",
  },
  { name: "Dribbble", url: "https://dribbble.com/donaelwalter" },
  { name: "Behance", url: "https://www.behance.net/donawalt/" },
  { name: "Instagram", url: "https://www.instagram.com/walt_dona/" },
  { name: "GitHub", url: "https://github.com/Donawalt" },
];

export const SITE = {
  name: "Donaël Walter",
  role: "Design Engineer & Creative Developer",
  statement:
    "Donaël Walter — design engineer & creative developer based in Lyon, France. I help startups, agencies, and premium brands turn goals into polished web experiences, blending branding, UX, UI, and front-end development in one workflow.",
  description:
    "Donaël Walter — design engineer & creative developer based in Lyon, France. I help startups, agencies, and premium brands turn goals into polished web experiences, blending branding, UX, UI, and front-end development in one workflow.",
  email: "contact@donaelwalter.com",
  url: SITE_URL,
  lang: "en",
  locale: "en_US",
  keywords:
    "design engineer, creative developer, branding, UI/UX design, front-end development, web design, Lyon, France",
  bio: "I'm Donaël Walter, a hybrid design engineer and creative developer based in Lyon, France. I blend branding, UX, UI, visual design, and front-end development into one seamless workflow — from visual identity to polished, performant web experiences.",
  availability:
    "Currently available for freelance projects — based in Lyon, France, working remotely worldwide.",
  services: [
    {
      title: "Branding & Identity",
      description:
        "Visual identities, art direction, and brand systems that give products a distinct voice.",
    },
    {
      title: "UI / UX Design",
      description:
        "Interfaces designed around users' needs and business goals — from wireframes to polished screens.",
    },
    {
      title: "Creative Development",
      description:
        "High-performance front-end and WebGL experiences built with Astro, React, Three.js, and GSAP.",
    },
  ],
  process: [
    {
      title: "Discover",
      description: "Understanding the goals, audience, and constraints before designing anything.",
    },
    {
      title: "Design",
      description: "Crafting the brand, interface, and overall experience.",
    },
    {
      title: "Develop",
      description: "Building a fast, accessible, and polished front-end.",
    },
    {
      title: "Deliver",
      description: "Launching, measuring, and iterating on the results.",
    },
  ],
  aiBots: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended", "CCBot"],
  officialPages: [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Design projects", path: "/projects/design" },
    { name: "Development projects", path: "/projects/development" },
    { name: "Photography", path: "/projects/photography" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Craft", path: "/craft" },
  ],
  jobTitle: "Design Engineer & Creative Developer",
  knowsAbout: [
    "Branding",
    "UX Design",
    "UI Design",
    "Front-End Development",
    "Web Development",
  ],
  knowsLanguage: ["en", "fr"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lyon",
    addressRegion: "Auvergne-Rhône-Alpes",
    addressCountry: "FR",
  },
  sameAs: SOCIALS.map((social) => social.url),
} as const;

export const canonical = (path = "") =>
  path ? `${SITE_URL}/${path.replace(/^\//, "")}` : `${SITE_URL}/`;

export const BOOKING_SUBJECT = "Book a call";
export const BOOKING_URI = `mailto:${SITE.email}?subject=${encodeURIComponent(BOOKING_SUBJECT)}`;

export const pageTitle = (title?: string) => {
  if (!title) return `${SITE.name} — ${SITE.role}`;
  if (title.includes(SITE.name)) return title;
  return `${title} | ${SITE.name}`;
};

export const personWebsiteGraph = () => [
  {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE.name,
    url: SITE_URL,
    jobTitle: SITE.jobTitle,
    address: SITE.address,
    knowsAbout: SITE.knowsAbout,
    knowsLanguage: SITE.knowsLanguage,
    sameAs: SITE.sameAs,
  },
  {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { "@id": `${SITE_URL}/#person` },
  },
];
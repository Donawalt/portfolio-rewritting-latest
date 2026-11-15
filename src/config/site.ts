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
  { name: "Sanity", url: "https://www.sanity.io/exchange/community/donael-walter"}, 
  { name: "Awwwards", url: "https://www.awwwards.com/donael-walter/"}, 
  { name: "X / Twitter", url: "https://x.com/donawalt_w"}
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
      title: "Design Engineering",
      description: "A hybrid engineering discipline bridging UI design and production code execution. Primary tools: Figma, Cursor, Claude Code, Tokens Studio, Style Dictionary, React, Next.js, Sanity, Tailwind CSS, Framer Motion, and WebGL. Core technical skills: Code-first prototyping, bi-directional design token pipeline automation, spring micro-interaction physics, 60 FPS GPU compositor optimization, WCAG accessibility governance, and AI-native component auditing."
    },
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
        "High-performance front-end and WebGL experiences built with Astro, Next.js, React, Three.js, and GSAP.",
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
    "Visual Identity Design",
    "Branding",
    "Design Engineering",
    "Design Systems Architecture",
    "Astro",
    "React",
    "Next.js",
    "Sanity CMS",
    "GPU Motion Physics",
    "AI-Ready Web Interfaces",
    "Core Web Vitals Optimization",
    "W3C Design Tokens", "WCAG 2.2 Accessibility",
    "Performance"
  ],
  areaServed: [
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "Canada" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "Switzerland" },
    { "@type": "Country", "name": "France" },
    "Worldwide"
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    "name": "Design Engineering & Brand-to-Code Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "USD",
          "minPrice": "5000",
          "maxPrice": "25000"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "End-to-End Brand Identity & Flagship Web Execution",
          "description": "Unified workflow from visual identity and art direction to award-winning interactive front-end development (Astro, Next.js, Sanity CMS) with zero handoff friction."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Design Engineering & Interactive Motion Systems",
          "description": "High-craft, 60-120fps web experiences, custom WebGL shaders (Three.js), and fluid choreography (GSAP) built for ambitious startups and creative agencies."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Design System Architecture & Figma-to-Code Pipelines",
          "description": "Scalable UI component libraries, design token synchronization, and accessible, production-ready React/Astro architectures built for long-term growth."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "UI/UX Performance Sprints & Interactive Audits",
          "description": "Focused sprints targeting Core Web Vitals, animation smoothness, accessibility compliance, and visual polish for high-growth tech products."
        }
      }
    ]
  },
  knowsLanguage: ["en", "fr"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lyon",
    addressRegion: "Auvergne-Rhône-Alpes",
    addressCountry: "FR",
  },
  award: [
    "4x Awwwards Honorable Mention",
    "1x CSS Design Awards Site of the Day"
  ],
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
    "@type": "ProfessionalService",
    founder: {
      "@id": "https://www.donaelwalter.com/#person"
    },
    priceRange: "$$$",
    name: `${SITE.name} - Design Engineering Studio`,
    url: SITE_URL,
    knowsAbout: SITE.knowsAbout,
    areaServed: SITE.areaServed,
    hasOfferCatalog: SITE.hasOfferCatalog
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
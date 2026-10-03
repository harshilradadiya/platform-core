export interface FaqItemSchema {
  question: string;
  answer: string;
}

export interface HowToStepSchema {
  name: string;
  text: string;
}

export interface BreadcrumbItemSchema {
  name: string;
  url: string;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MediaFlow',
    url: 'https://mediaflow.app',
    description: 'High-speed media resolution engine and video downloader with zero server buffering.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mediaflow.app/?url={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MediaFlow',
    url: 'https://mediaflow.app',
    logo: 'https://mediaflow.app/favicon.ico',
    sameAs: ['https://github.com/mediaflow-app'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@mediaflow.app',
      contactType: 'customer support',
    },
  };
}

export function softwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MediaFlow',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All (Web-based)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Paste a YouTube or Pinterest link and get every download format in under 2 seconds. Zero uploads, zero storage, DMCA compliant.',
  };
}

export function faqSchema(items: FaqItemSchema[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function howToSchema(steps: HowToStepSchema[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to download videos with MediaFlow',
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function breadcrumbSchema(crumbs: BreadcrumbItemSchema[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact MediaFlow',
    url: 'https://mediaflow.app/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'MediaFlow',
      email: 'support@mediaflow.app',
    },
  };
}

export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About MediaFlow',
    url: 'https://mediaflow.app/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'MediaFlow',
      url: 'https://mediaflow.app',
      description: 'Zero-buffer stream pass-through media downloader.',
    },
  };
}

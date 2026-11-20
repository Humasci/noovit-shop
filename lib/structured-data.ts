// Schema.org helpers shared by every page (JSON-LD via components/seo/JsonLd.tsx). Google reads breadcrumbs for the
// path shown in results; CollectionPage + ItemList tell it which products/pages a hub lists.
import { LEGAL_NAME, SITE_URL } from '@/lib/site';

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path === '/' ? '' : path}`);

export const ORG_ID = `${SITE_URL}/#organization`;

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Noovit',
  legalName: LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  address: { '@type': 'PostalAddress', streetAddress: '30 N Gould St Ste R', addressLocality: 'Sheridan', addressRegion: 'WY', postalCode: '82801', addressCountry: 'US' },
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Noovit',
  url: SITE_URL,
  publisher: { '@id': ORG_ID },
};

// crumbs: [name, path] from Home down to the current page.
export function breadcrumbLd(crumbs: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'] as [string, string], ...crumbs].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
  };
}

// A page with breadcrumbs; with `items` it becomes a CollectionPage listing them.
export function pageLd({ path, name, description, crumbs, items, type }: {
  path: string;
  name: string;
  description?: string;
  crumbs: [string, string][];
  items?: { name: string; path: string }[];
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' | 'FAQPage';
}) {
  const page = {
    '@context': 'https://schema.org',
    '@type': type ?? (items?.length ? 'CollectionPage' : 'WebPage'),
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name,
    ...(description ? { description } : {}),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': ORG_ID },
    ...(items?.length
      ? { mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.path) })) } }
      : {}),
  };
  return [page, breadcrumbLd(crumbs)];
}

// FAQPage from question/answer pairs (answers may contain simple text only).
export const faqLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

// Guides public before launch (owner, 20 Nov): these pages skip the coming-soon gate and are indexable while the rest
// of the site stays private, so they can start ranking early. No imports: next.config.ts and proxy.ts both read it.
// Add a slug only for a finished guide (sources verified). Biotin waits for the NIH ODS / FDA checks in the TODO.
export const PUBLIC_EARLY_GUIDES = ['magnesium', 'magnesium-glycinate', 'creatine', 'lions-mane', 'coq10', 'ashwagandha', 'turmeric'];

export const PUBLIC_EARLY_PATHS = ['/guides', ...PUBLIC_EARLY_GUIDES.map((s) => `/guides/${s}`)];
export const isPublicEarly = (pathname: string) => PUBLIC_EARLY_PATHS.includes(pathname.replace(/\/+$/, '') || '/');

// next.config header source: every path except the public guides and the crawler files (sitemap, robots, llms.txt).
export const NOINDEX_SOURCE = `/:path((?!guides(?:/(?:${PUBLIC_EARLY_GUIDES.join('|')}))?/?$|sitemap\\.xml$|robots\\.txt$|llms\\.txt$).*)`;

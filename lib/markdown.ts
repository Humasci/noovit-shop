import { Marked, Tokens } from 'marked';

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Only site-relative paths, anchors and http(s)/mailto URLs survive; javascript: and data: URLs are dropped.
const safeHref = (href: string) => {
  const h = href.trim();
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(h) ? h : '';
};

// Heading anchors (for the table of contents): "Can I take it at night?" → "can-i-take-it-at-night".
export const headingId = (text: string) =>
  text.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);

const marked = new Marked({ gfm: true });
marked.use({
  renderer: {
    heading(this: { parser: { parseInline: (t: Tokens.Heading['tokens']) => string } }, token: Tokens.Heading) {
      const text = this.parser.parseInline(token.tokens);
      return `<h${token.depth} id="${headingId(token.text)}">${text}</h${token.depth}>\n`;
    },
    html: () => '', // raw HTML in posts is never rendered
    link(this: { parser: { parseInline: (t: Tokens.Link['tokens']) => string } }, token: Tokens.Link) {
      const text = this.parser.parseInline(token.tokens);
      const href = safeHref(token.href);
      if (!href) return text;
      const external = /^https?:\/\//i.test(href) && !href.includes('noovit.com');
      return `<a href="${escapeAttr(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
    },
    image(token: Tokens.Image) {
      const src = safeHref(token.href);
      return src ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(token.text)}" loading="lazy" />` : '';
    },
  },
});

export const renderMarkdown = (md: string) => marked.parse(md, { async: false }) as string;

// The post's H2 sections, for "In this article". Skips the closing Sources list.
export const markdownToc = (md: string) =>
  marked
    .lexer(md)
    .filter((t): t is Tokens.Heading => t.type === 'heading' && (t as Tokens.Heading).depth === 2)
    .map((t) => ({ id: headingId(t.text), text: t.text.replace(/[*_`]/g, '') }))
    .filter((h) => !/^(sources|references)$/i.test(h.text.trim()));

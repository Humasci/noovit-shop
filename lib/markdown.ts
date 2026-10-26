import { Marked, Tokens } from 'marked';

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Only site-relative paths, anchors and http(s)/mailto URLs survive; javascript: and data: URLs are dropped.
const safeHref = (href: string) => {
  const h = href.trim();
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(h) ? h : '';
};

const marked = new Marked({ gfm: true });
marked.use({
  renderer: {
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

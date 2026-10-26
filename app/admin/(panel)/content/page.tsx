import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { CONTENT_FIELDS, loadContent } from '@/lib/content';
import { resetContent, saveContent } from '@/app/admin/content-actions';
import { Card, Flash, NotConfigured, PageTitle, btnSm, btnSmOutline, inputCls } from '@/components/admin/ui';

const GROUPS = [
  { title: 'Announcement bar', keys: ['announcement_text', 'announcement_link'] },
  { title: 'Trust bar', keys: ['trust_bar'] },
  { title: 'Homepage hero', keys: ['hero_badge', 'hero_headline', 'hero_subheadline', 'hero_cta_label', 'hero_cta_link', 'hero_bullets'] },
  { title: 'Newsletter pop-up', keys: ['popup_headline', 'popup_text'] },
] as const;

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireAdmin('content');
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Homepage" /><NotConfigured what="The database" /></>);
  const content = await loadContent();

  return (
    <>
      <PageTitle title="Homepage">
        <a href="/" target="_blank" className={btnSmOutline}>View store</a>
      </PageTitle>
      <Flash msg={msg} />
      <form action={saveContent} className="space-y-6">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <h2 className="mb-4 text-lg">{g.title}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {g.keys.map((key) => {
                const field = CONTENT_FIELDS[key];
                return (
                  <label key={key} className={field.rows > 1 ? 'md:col-span-2' : ''}>
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{field.label}</span>
                    {field.rows > 1 ? (
                      <textarea name={key} rows={field.rows} defaultValue={content[key]} maxLength={field.max} className={`${inputCls} w-full`} />
                    ) : (
                      <input name={key} defaultValue={content[key]} maxLength={field.max} className={`${inputCls} w-full`} />
                    )}
                    {field.hint && <span className="mt-1 block text-xs text-[var(--color-muted)]">{field.hint}</span>}
                  </label>
                );
              })}
            </div>
          </Card>
        ))}
        <Card>
          <h2 className="mb-3 text-lg">Hero image</h2>
          <img src={content.hero_image} alt="" className="mb-3 aspect-[21/9] w-full max-w-xl rounded-xl object-cover" />
          <input type="file" name="hero_image_file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
          <p className="mt-1 text-xs text-[var(--color-muted)]">Wide landscape photo (at least 1920px wide), up to 4 MB. The left side sits behind the text.</p>
        </Card>
        <div className="flex gap-2">
          <button className={btnSm}>Save homepage</button>
        </div>
      </form>
      <form action={resetContent} className="mt-4">
        <button className="text-xs text-[var(--color-muted)] underline">Reset all homepage text to defaults</button>
      </form>
    </>
  );
}

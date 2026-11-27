'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { CONSENT_KEY } from '@/lib/analytics';
import { isSensitivePath } from '@/lib/tests';

export interface PixelIds {
  gtm: string;
  ga4: string;
  meta: string;
  tiktok: string;
  bing?: string;
}

const CHANGE_EVENT = 'noovit-consent-change';
export const OPEN_PREFERENCES_EVENT = 'noovit-open-cookie-preferences';

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener(OPEN_PREFERENCES_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener(OPEN_PREFERENCES_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
};
// Global Privacy Control (browser opt-out signal) counts as Decline (CCPA "do not sell or share").
const readConsent = () => ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl ? 'denied' : localStorage.getItem(CONSENT_KEY) ?? 'unset');

function setConsent(value: 'granted' | 'denied') {
  localStorage.setItem(CONSENT_KEY, value);
  // Declining reloads the page so nothing that already loaded keeps running.
  if (value === 'denied') window.location.reload();
  else window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openCookiePreferences() {
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

function PageViews() {
  const pathname = usePathname();
  useEffect(() => {
    if (isSensitivePath(pathname)) {
      // never report views of health pages; if tags already loaded on an earlier page (client navigation or back
      // button), reload so this page runs without them
      const w = window as unknown as Record<string, unknown>;
      if (w.google_tag_manager || w.fbq || w.ttq || w.gtag || w.uetq) window.location.reload();
      return;
    }
    window.gtag?.('event', 'page_view', { page_path: pathname, page_location: window.location.href.replace(/([?&])session_id=[^&]*&?/, '$1').replace(/[?&]$/, '') });
    window.fbq?.('track', 'PageView');
    window.ttq?.page();
  }, [pathname]);
  return null;
}

// IDs are validated against strict patterns when saved, and JSON-encoded here before going into inline scripts.
// Opt-out model (US store): tags load straight away; "Decline" turns them off for this browser.
export function Analytics({ ids }: { ids: PixelIds }) {
  const consent = useSyncExternalStore(subscribe, readConsent, () => 'pending');
  const pathname = usePathname();
  const any = Boolean(ids.gtm || ids.ga4 || ids.meta || ids.tiktok || ids.bing);
  // Sensitive pages (STI test) load no tags at all; links to them are full page loads, so earlier tags don't carry over.
  if (!any || consent === 'pending' || consent === 'denied' || isSensitivePath(pathname)) return null;

  return (
    <>
      <DeferredTags ids={ids} />
      {consent === 'unset' && <Banner />}
    </>
  );
}

// PageSpeed (27 Nov): Tag Manager (and Clarity inside it) blocked the phone's main thread for ~0.6 s during load.
// Tags now load on the visitor's first interaction (tap, scroll, key) or 3.5 s after the page has loaded, whichever
// comes first; checkout pages load them straight away so purchases are never missed. Events fired before that wait
// in the dataLayer / uetq queues, which GTM and UET read when they start.
function DeferredTags({ ids }: { ids: PixelIds }) {
  const pathname = usePathname();
  const immediate = pathname.startsWith('/checkout');
  const [ready, setReady] = useState(immediate);
  useEffect(() => {
    const w = window as unknown as { dataLayer?: unknown[]; uetq?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.uetq = w.uetq || [];
    if (ready) return;
    const go = () => setReady(true);
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startTimer = () => { timer = setTimeout(go, 3500); };
    if (document.readyState === 'complete') startTimer();
    else window.addEventListener('load', startTimer, { once: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener('load', startTimer);
      if (timer) clearTimeout(timer);
    };
  }, [ready]);
  return ready ? <Tags ids={ids} /> : null;
}

function Banner() {
  return (
    <div role="region" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-white p-4 shadow-2xl md:inset-x-auto md:bottom-4 md:left-4 md:max-w-md md:rounded-2xl md:border">
      <p className="text-sm">
        We use cookies to measure site traffic and show you relevant ads. Decline to opt out; you can change your choice anytime from &ldquo;Cookie preferences&rdquo; in the footer.
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setConsent('granted')} className="btn btn-primary !px-5 !py-2 text-sm">Accept</button>
        <button onClick={() => setConsent('denied')} className="btn btn-outline !px-5 !py-2 text-sm">Decline</button>
      </div>
    </div>
  );
}

function Tags({ ids }: { ids: PixelIds }) {
  return (
    <>
      {/* Google Tag Manager, on every page unless the visitor opted out. Single-page navigations
          reach GA4 through its "page changes based on browser history" setting; shop events arrive via dataLayer (lib/analytics.ts). */}
      {ids.gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(ids.gtm)});`}
        </Script>
      )}
      {ids.ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.ga4)}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ids.ga4)},{send_page_view:false});gtag('event','page_view',{page_path:location.pathname,page_location:location.href.replace(/([?&])session_id=[^&]*&?/,'$1').replace(/[?&]$/,'')});`}
          </Script>
        </>
      )}
      {ids.meta && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(ids.meta)});fbq('track','PageView');`}
        </Script>
      )}
      {ids.tiktok && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=r+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(${JSON.stringify(ids.tiktok)});ttq.page();}(window,document,'ttq');`}
        </Script>
      )}
      {/* Microsoft Ads UET (Bing): page views on every page incl. single-page navigations (enableAutoSpaTracking),
          shop events via lib/analytics.ts. Same opt-out and health-page rules as the other tags. */}
      {ids.bing && (
        <Script id="bing-uet" strategy="afterInteractive">
          {`(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:${JSON.stringify(ids.bing)},enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","https://bat.bing.net/bat.js","uetq");`}
        </Script>
      )}
      <PageViews />
    </>
  );
}

export function CookiePreferencesLink() {
  return (
    <button onClick={openCookiePreferences} className="hover:text-white">
      Cookie preferences
    </button>
  );
}

'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { CONSENT_KEY } from '@/lib/analytics';

export interface PixelIds {
  gtm: string;
  ga4: string;
  meta: string;
  tiktok: string;
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
const readConsent = () => localStorage.getItem(CONSENT_KEY) ?? 'unset';

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
    window.gtag?.('event', 'page_view', { page_path: pathname, page_location: window.location.href });
    window.fbq?.('track', 'PageView');
    window.ttq?.page();
  }, [pathname]);
  return null;
}

// IDs are validated against strict patterns when saved, and JSON-encoded here before going into inline scripts.
// Opt-out model (US store): tags load straight away; "Decline" turns them off for this browser.
export function Analytics({ ids }: { ids: PixelIds }) {
  const consent = useSyncExternalStore(subscribe, readConsent, () => 'pending');
  const any = Boolean(ids.gtm || ids.ga4 || ids.meta || ids.tiktok);
  if (!any || consent === 'pending' || consent === 'denied') return null;

  return (
    <>
      <Tags ids={ids} />
      {consent === 'unset' && <Banner />}
    </>
  );
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
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ids.ga4)},{send_page_view:false});gtag('event','page_view',{page_path:location.pathname,page_location:location.href});`}
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

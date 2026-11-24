import Script from "next/script";

// Google Analytics 4 (Rob's property "HomeWODRx", added 2026-11-23).
// Consent mode: analytics runs by default, except in the EEA, UK and Switzerland, where it
// stays off until the visitor accepts in the cookie banner (ConsentBanner). Advertising
// signals are always off. A saved choice from the banner overrides the default.
export const GA_ID = "G-HZM475VDN3";

const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

const init = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var ads={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
gtag('consent','default',Object.assign({analytics_storage:'granted'},ads));
gtag('consent','default',Object.assign({analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)}},ads));
try{var c=localStorage.getItem('hwrx-consent');if(c==='granted'||c==='denied')gtag('consent','update',{analytics_storage:c})}catch(e){}
gtag('js',new Date());gtag('config','${GA_ID}');`;

export function Analytics() {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return null;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: init }} />
      <Script id="ga-lib" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
    </>
  );
}

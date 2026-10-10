import Script from "next/script";

const measurementId = "G-T8HQENKS1N";

export default function GoogleAnalytics() {
  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ window.dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
      <Script id="google-analytics-tag" strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
    </>
  );
}

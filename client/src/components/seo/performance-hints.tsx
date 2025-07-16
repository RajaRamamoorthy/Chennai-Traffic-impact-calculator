import { Helmet } from 'react-helmet-async';

interface PerformanceHintsProps {
  preloadFonts?: string[];
  preconnectUrls?: string[];
  dnsUrls?: string[];
  criticalImages?: string[];
}

export function PerformanceHints({ 
  preloadFonts = [],
  preconnectUrls = [],
  dnsUrls = [],
  criticalImages = []
}: PerformanceHintsProps) {
  // Default performance optimizations for Chennai Traffic Calculator
  const defaultPreconnects = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://maps.googleapis.com',
    'https://maps.gstatic.com'
  ];

  const defaultDnsPrefetch = [
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://clarity.microsoft.com'
  ];

  const allPreconnects = [...new Set([...defaultPreconnects, ...preconnectUrls])];
  const allDnsPrefetch = [...new Set([...defaultDnsPrefetch, ...dnsUrls])];

  return (
    <Helmet>
      {/* DNS Prefetch for faster domain resolution */}
      {allDnsPrefetch.map(url => (
        <link key={url} rel="dns-prefetch" href={url} />
      ))}
      
      {/* Preconnect for critical third-party resources */}
      {allPreconnects.map(url => (
        <link key={url} rel="preconnect" href={url} />
      ))}
      
      {/* Preload critical fonts */}
      {preloadFonts.map(font => (
        <link 
          key={font}
          rel="preload" 
          href={font} 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
      ))}
      
      {/* Preload critical images */}
      {criticalImages.map(image => (
        <link 
          key={image}
          rel="preload" 
          href={image} 
          as="image"
        />
      ))}
      
      {/* Resource hints for better performance */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="prefetch" href="/calculator" />
      <link rel="prefetch" href="/dashboard" />
      
      {/* Core Web Vitals optimization hints */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
}

// Component for critical CSS inlining hints
export function CriticalCSS() {
  return (
    <Helmet>
      <style type="text/css">{`
        /* Critical above-the-fold styles */
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin: 0;
          padding: 0;
        }
        .loading-placeholder {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Helmet>
  );
}
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
  noindex?: boolean;
}

const defaultMeta = {
  title: 'Chennai Traffic Impact Calculator - Calculate Your Commute Impact',
  description: 'Calculate how your daily commute affects Chennai traffic. Get personalized suggestions for better alternatives and reduce your environmental impact.',
  keywords: 'Chennai traffic, commute calculator, traffic impact, sustainable transport, Chennai transport, public transport Chennai, carbon footprint, traffic congestion',
  ogImage: 'https://chennaitrafficcalc.in/og-image.png',
  siteName: 'Chennai Traffic Impact Calculator',
  siteUrl: 'https://chennaitrafficcalc.in'
};

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  noindex = false
}: SEOProps) {
  const finalTitle = title ? `${title} | Chennai Traffic Impact Calculator` : defaultMeta.title;
  const finalDescription = description || defaultMeta.description;
  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || finalDescription;
  const finalOgImage = ogImage || defaultMeta.ogImage;
  const finalOgUrl = ogUrl || canonical || defaultMeta.siteUrl;
  const finalKeywords = keywords || defaultMeta.keywords;

  // Default organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Chennai Traffic Impact Calculator",
    "url": defaultMeta.siteUrl,
    "logo": defaultMeta.ogImage,
    "description": defaultMeta.description,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@chennaitrafficcalc.in",
      "contactType": "Customer Support",
      "availableLanguage": ["English", "Tamil"]
    }
  };

  // Website structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Chennai Traffic Impact Calculator",
    "url": defaultMeta.siteUrl,
    "description": defaultMeta.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${defaultMeta.siteUrl}/calculator?origin={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* OpenGraph Tags */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:url" content={finalOgUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={defaultMeta.siteName} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image:alt" content="Chennai Traffic Impact Calculator" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || finalOgTitle} />
      <meta name="twitter:description" content={twitterDescription || finalOgDescription} />
      <meta name="twitter:image" content={twitterImage || finalOgImage} />
      <meta name="twitter:site" content="@chennaitraffic" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Chennai Traffic Impact Calculator" />
      <meta name="generator" content="React, Vite" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#10b981" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Chennai Traffic Calc" />
      
      {/* Language and Region */}
      <meta property="og:locale:alternate" content="ta_IN" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
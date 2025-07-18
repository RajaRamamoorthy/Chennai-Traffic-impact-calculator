import { Helmet } from 'react-helmet-async';
import { PerformanceHints } from './seo/performance-hints';

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
  title: 'Chennai Traffic Impact Calculator – Live Jam & Commute Insights',
  description: 'Check live Chennai traffic, calculate your commute impact, and discover faster routes. Free tool with financial insights, monthly cost analysis, and money-saving alternatives.',
  keywords: 'Chennai traffic, Chennai traffic today, Chennai traffic jam, Chennai traffic calculator, Chennai traffic impact, Chennai congestion score, Chennai jam tracker, Chennai commute, Chennai commute distance, Chennai travel time, Chennai road congestion, Chennai road traffic, Chennai traffic live, Chennai traffic map, Chennai traffic update, Chennai peak hour traffic, Chennai delay calculator, Chennai driving time, traffic calculator Chennai, commute calculator Chennai, Chennai traffic score, Chennai congestion predictor, Kathipara flyover traffic, OMR traffic status, GST Road traffic, Anna Salai traffic, Marina Beach traffic, T Nagar traffic, Chennai route planner, Chennai traffic dashboard, Chennai traffic analysis, Chennai commute cost, Chennai monthly commute cost, Chennai travel cost calculator, Chennai financial insights, Chennai cost savings, Chennai money saving alternatives, Chennai transport cost analysis, Chennai fuel cost calculator, Chennai commute budget, Chennai travel expense, Chennai cost per km, Chennai financial dashboard, Chennai commute cost optimization, Chennai transport financial analysis',
  ogImage: 'https://chennaitrafficcalc.in/og-image.svg',
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

  // Microsoft Clarity is now loaded directly in index.html for better reliability
  // This ensures it loads early and captures all page views correctly

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

  // Web Application structured data
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chennai Traffic Impact Calculator",
    "url": defaultMeta.siteUrl,
    "description": "Free web application to calculate traffic impact, analyze commute costs, and discover sustainable transportation alternatives in Chennai with financial insights",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Any",
    "permissions": "free",
    "keywords": "Chennai traffic, Chennai commute, Chennai traffic calculator, Chennai traffic jam, Chennai congestion score, Chennai jam tracker, Chennai traffic live, Chennai route planner, Chennai traffic analysis, Chennai commute cost, Chennai financial insights, Chennai cost savings, Chennai transport cost analysis",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "Live Chennai traffic monitoring",
      "Chennai congestion score calculation", 
      "Chennai route optimization",
      "Chennai commute impact analysis",
      "Real-time Chennai traffic updates",
      "Chennai peak hour traffic tracking",
      "Monthly commute cost analysis",
      "Financial insights and cost savings",
      "Transport cost per kilometer calculation",
      "Money-saving route alternatives",
      "Real-time financial dashboard",
      "Chennai commute budget optimization"
    ],
    "author": {
      "@type": "Organization",
      "name": "Chennai Traffic Impact Calculator",
      "url": defaultMeta.siteUrl
    }
  };

  // LocalBusiness schema for Chennai traffic service
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Chennai Traffic Impact Calculator",
    "description": "Chennai traffic monitoring and commute cost calculator service",
    "url": defaultMeta.siteUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "13.0827",
      "longitude": "80.2707"
    },
    "areaServed": {
      "@type": "City",
      "name": "Chennai",
      "sameAs": "https://en.wikipedia.org/wiki/Chennai"
    },
    "serviceType": "Traffic Monitoring and Route Planning",
    "priceRange": "Free"
  };

  // Place schema for Chennai
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "Chennai",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "13.0827",
      "longitude": "80.2707"
    },
    "containedInPlace": {
      "@type": "State",
      "name": "Tamil Nadu"
    },
    "description": "Chennai traffic monitoring zone covered by Chennai Traffic Impact Calculator"
  };

  return (
    <>
      <PerformanceHints />
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
      <script type="application/ld+json">
        {JSON.stringify(webApplicationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(placeSchema)}
      </script>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
    </>
  );
}
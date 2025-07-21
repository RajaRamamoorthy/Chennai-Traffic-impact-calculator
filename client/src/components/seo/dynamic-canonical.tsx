import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";

interface DynamicCanonicalProps {
  canonicalUrl?: string;
  noindex?: boolean;
}

export function DynamicCanonical({ canonicalUrl, noindex = false }: DynamicCanonicalProps) {
  const [location] = useLocation();
  
  // Default to current path without query parameters for canonical
  const baseUrl = "https://chennaitrafficcalc.in";
  const cleanPath = location.split('?')[0];
  const defaultCanonical = `${baseUrl}${cleanPath}`;
  
  // For calculator pages with parameters, use base calculator URL
  const finalCanonical = canonicalUrl || 
    (location.startsWith('/calculator') ? `${baseUrl}/calculator` : defaultCanonical);

  return (
    <Helmet>
      <link rel="canonical" href={finalCanonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}
    </Helmet>
  );
}
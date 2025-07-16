import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  // Generate structured data for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://chennaitrafficcalc.in/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `https://chennaitrafficcalc.in${item.href}` : undefined
      })),
      {
        "@type": "ListItem",
        "position": items.length + 2,
        "name": currentPage
      }
    ]
  };

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
        <Link href="/">
          <span className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </span>
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4" />
            {item.href ? (
              <Link href={item.href}>
                <span className="hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </div>
        ))}
        
        <div className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{currentPage}</span>
        </div>
      </nav>
    </>
  );
}
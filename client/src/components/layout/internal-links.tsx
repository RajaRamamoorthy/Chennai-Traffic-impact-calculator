import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BarChart, MapPin, HelpCircle, TrendingUp } from "lucide-react";

interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface InternalLinksProps {
  currentPage: string;
  relatedLinks?: RelatedLink[];
}

export function InternalLinks({ currentPage, relatedLinks }: InternalLinksProps) {
  // Default related links based on current page
  const getDefaultLinks = (page: string): RelatedLink[] => {
    const allLinks: Record<string, RelatedLink[]> = {
      home: [
        {
          title: "Traffic Calculator",
          description: "Calculate your Chennai commute impact and discover alternatives",
          href: "/calculator",
          icon: Calculator
        },
        {
          title: "Live Traffic Dashboard",
          description: "Real-time Chennai traffic conditions and route monitoring",
          href: "/dashboard",
          icon: BarChart
        },
        {
          title: "FAQ",
          description: "Common questions about Chennai traffic and calculator usage",
          href: "/faq",
          icon: HelpCircle
        }
      ],
      calculator: [
        {
          title: "How It Works",
          description: "Understand the methodology behind traffic impact calculations",
          href: "/how-it-works",
          icon: TrendingUp
        },
        {
          title: "Traffic Dashboard",
          description: "View live Chennai traffic conditions and patterns",
          href: "/dashboard",
          icon: BarChart
        },
        {
          title: "Data Sources",
          description: "Learn about the data powering our traffic calculations",
          href: "/data-sources",
          icon: MapPin
        }
      ],
      dashboard: [
        {
          title: "Calculate Impact",
          description: "Use our calculator to analyze your specific commute",
          href: "/calculator",
          icon: Calculator
        },
        {
          title: "Methodology",
          description: "Detailed explanation of our traffic analysis methods",
          href: "/methodology",
          icon: TrendingUp
        },
        {
          title: "FAQ",
          description: "Frequently asked questions about traffic data and usage",
          href: "/faq",
          icon: HelpCircle
        }
      ],
      faq: [
        {
          title: "Start Calculating",
          description: "Try our traffic impact calculator for your Chennai commute",
          href: "/calculator", 
          icon: Calculator
        },
        {
          title: "Live Dashboard",
          description: "Check current Chennai traffic conditions and trends",
          href: "/dashboard",
          icon: BarChart
        },
        {
          title: "Support",
          description: "Contact us for technical support or feature requests",
          href: "/support",
          icon: HelpCircle
        }
      ]
    };

    return allLinks[page] || allLinks.home;
  };

  const linksToShow = relatedLinks || getDefaultLinks(currentPage);

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4 text-slate-900">Related Tools & Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {linksToShow.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <Link key={index} href={link.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Route hub component for traffic-specific pages
export function TrafficRouteHub() {
  const routeLinks = [
    {
      title: "Anna Salai Traffic",
      description: "Live traffic updates and best travel times for Anna Salai",
      href: "/traffic/anna-salai",
      icon: MapPin
    },
    {
      title: "OMR Traffic Status", 
      description: "Old Mahabalipuram Road traffic conditions and alternatives",
      href: "/traffic/omr",
      icon: MapPin
    },
    {
      title: "GST Road Traffic",
      description: "Grand Southern Trunk Road live traffic and route planning",
      href: "/traffic/gst-road",
      icon: MapPin
    },
    {
      title: "Kathipara Junction",
      description: "Real-time traffic updates for Chennai's major interchange",
      href: "/traffic/kathipara",
      icon: MapPin
    }
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4 text-slate-900">Chennai Traffic Routes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {routeLinks.map((route, index) => {
          const IconComponent = route.icon;
          return (
            <Link key={index} href={route.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <IconComponent className="h-4 w-4 text-green-600" />
                    {route.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{route.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
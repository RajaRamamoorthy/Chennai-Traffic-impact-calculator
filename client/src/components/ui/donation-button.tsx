import { HeartHandshake } from "lucide-react";

export function DonationButton() {
  // Simple, reliable approach - direct link to Razorpay payment page
  return (
    <a 
      href="https://pages.razorpay.com/pl_QrJvlLCM3GeHbV/view" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-sm hover:shadow-md"
    >
      <HeartHandshake className="h-4 w-4" />
      Donate Now
    </a>
  );
}
import { useEffect, useRef, useState } from "react";
import { HeartHandshake } from "lucide-react";

export function DonationButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptBlocked, setScriptBlocked] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if we're in Replit preview
    const isReplitPreview = window.location.hostname.includes('replit');
    
    if (isReplitPreview) {
      setScriptBlocked(true);
      return;
    }

    // Function to load Razorpay script
    const loadRazorpayScript = () => {
      try {
        // Check if script already exists
        const existingScript = document.getElementById('razorpay-payment-button-script');
        if (existingScript) {
          return;
        }

        // Create the container form
        if (containerRef.current) {
          const form = document.createElement('form');
          const script = document.createElement('script');
          script.id = 'razorpay-payment-button-script';
          script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
          script.setAttribute('data-payment_button_id', 'pl_QrJvlLCM3GeHbV');
          script.async = true;
          
          // Add error handler
          script.onerror = () => {
            console.log('Razorpay script blocked, showing fallback button');
            setScriptBlocked(true);
          };
          
          form.appendChild(script);
          containerRef.current.appendChild(form);
        }
      } catch (error) {
        console.error('Error loading Razorpay script:', error);
        setScriptBlocked(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadRazorpayScript, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Fallback button for Replit preview or when script is blocked
  if (scriptBlocked) {
    return (
      <a 
        href="https://pages.razorpay.com/pl_QrJvlLCM3GeHbV/view" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-sm"
      >
        <HeartHandshake className="h-4 w-4" />
        Donate Now
      </a>
    );
  }

  return (
    <div ref={containerRef} className="razorpay-payment-button-container">
      {/* Razorpay button will be injected here, fallback link shown if blocked */}
    </div>
  );
}
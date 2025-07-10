import { useEffect, useRef } from "react";

export function DonationButton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Function to load Razorpay script
    const loadRazorpayScript = () => {
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
        
        form.appendChild(script);
        containerRef.current.appendChild(form);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadRazorpayScript, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="razorpay-payment-button-container">
      {/* Razorpay button will be injected here */}
    </div>
  );
}
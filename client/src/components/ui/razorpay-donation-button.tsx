import { useEffect, useRef } from "react";

interface RazorpayDonationButtonProps {
  paymentButtonId: string;
}

export function RazorpayDonationButton({ paymentButtonId }: RazorpayDonationButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script is already loaded
    let script = document.querySelector('script[src="https://checkout.razorpay.com/v1/payment-button.js"]');
    
    if (!script) {
      // Create and load the script
      script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Create a form element and add it to our container
    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the form
      const form = document.createElement('form');
      
      // Create the script element for the button
      const buttonScript = document.createElement('script');
      buttonScript.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      buttonScript.setAttribute('data-payment_button_id', paymentButtonId);
      buttonScript.async = true;
      
      // Add script to form and form to container
      form.appendChild(buttonScript);
      containerRef.current.appendChild(form);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [paymentButtonId]);

  return (
    <div ref={containerRef} className="razorpay-donation-button">
      {/* Razorpay button will be injected here */}
    </div>
  );
}
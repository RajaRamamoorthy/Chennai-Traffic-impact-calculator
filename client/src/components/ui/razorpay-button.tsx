import { useEffect, useRef, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export function RazorpayButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paymentButtonId, setPaymentButtonId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch secure payment button ID from backend
    apiRequest('GET', '/api/razorpay-button-config')
      .then(res => res.json())
      .then(data => {
        if (data.paymentButtonId) {
          setPaymentButtonId(data.paymentButtonId);
        } else {
          console.error('No payment button ID in response');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load payment button config:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!paymentButtonId) return;

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

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-12 rounded"></div>;
  }

  if (!paymentButtonId) {
    return <div className="text-red-500 text-sm">Payment system unavailable</div>;
  }

  return (
    <div ref={containerRef} className="razorpay-button">
      {/* Razorpay button will be injected here */}
    </div>
  );
}
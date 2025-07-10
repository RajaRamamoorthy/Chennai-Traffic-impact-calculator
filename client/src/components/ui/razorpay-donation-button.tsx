import { useEffect, useRef } from "react";

interface RazorpayDonationButtonProps {
  paymentButtonId: string;
}

export function RazorpayDonationButton({ paymentButtonId }: RazorpayDonationButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Check if Razorpay script is already loaded
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/payment-button.js"]')) {
      return;
    }

    // Create and load the Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', paymentButtonId);
    script.async = true;

    // Add the script to the form
    if (formRef.current) {
      formRef.current.appendChild(script);
    }

    // Cleanup function to remove the script when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [paymentButtonId]);

  return (
    <form ref={formRef} className="razorpay-donation-form">
      {/* The Razorpay script will inject its button here */}
    </form>
  );
}
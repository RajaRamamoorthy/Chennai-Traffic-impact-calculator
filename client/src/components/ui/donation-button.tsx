import { HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function DonationButton() {
  const [razorpayKey, setRazorpayKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [showAmountSelector, setShowAmountSelector] = useState(false);

  const donationAmounts = [
    { value: 50, label: '₹50' },
    { value: 100, label: '₹100' },
    { value: 500, label: '₹500' },
    { value: 1000, label: '₹1000' }
  ];

  useEffect(() => {
    // Load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch Razorpay key from server
    apiRequest('GET', '/api/razorpay-config')
      .then(res => res.json())
      .then(data => {
        if (data.keyId) {
          setRazorpayKey(data.keyId);
          console.log('Razorpay key loaded successfully');
        } else {
          console.error('No Razorpay key in response');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Razorpay config:', err);
        setIsLoading(false);
      });

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleDonation = () => {
    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    if (!razorpayKey) {
      alert('Payment configuration is missing. Please try again later.');
      return;
    }

    // Create payment options
    const options = {
      key: razorpayKey,
      amount: selectedAmount * 100, // Convert to paise
      currency: 'INR',
      name: 'Chennai Traffic Impact Calculator',
      description: 'Support our mission',
      image: '/icon-192.png',
      handler: function (response: any) {
        // Payment successful - redirect to thank you page
        window.location.href = '/thank-you';
      },
      prefill: {
        name: '',
        email: '',
      },
      theme: {
        color: '#10b981'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
          setShowAmountSelector(false);
        }
      }
    };

    // Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleButtonClick = () => {
    if (!showAmountSelector) {
      setShowAmountSelector(true);
    } else {
      handleDonation();
    }
  };

  if (showAmountSelector) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-slate-600 mb-2">Select donation amount:</div>
        <div className="flex gap-2 flex-wrap">
          {donationAmounts.map((amount) => (
            <button
              key={amount.value}
              onClick={() => setSelectedAmount(amount.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedAmount === amount.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {amount.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDonation}
            disabled={isLoading || !razorpayKey}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-md transition-colors shadow-sm hover:shadow-md"
          >
            <HeartHandshake className="h-4 w-4" />
            Donate {donationAmounts.find(a => a.value === selectedAmount)?.label}
          </button>
          <button 
            onClick={() => setShowAmountSelector(false)}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleButtonClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-sm hover:shadow-md"
    >
      <HeartHandshake className="h-4 w-4" />
      Donate Now
    </button>
  );
}
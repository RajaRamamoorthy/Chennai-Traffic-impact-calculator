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
  const [amount, setAmount] = useState<string>('');
  const [showAmountInput, setShowAmountInput] = useState(false);

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

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      alert('Please enter a valid amount (minimum ₹1)');
      return;
    }

    // Validate maximum donation amount to prevent fraud
    if (numericAmount > 100000) {
      alert('Maximum donation amount is ₹1,00,000. Please contact us for larger donations.');
      return;
    }

    // Create payment options
    const options = {
      key: razorpayKey,
      amount: Math.round(numericAmount * 100), // Convert to paise
      currency: 'INR',
      name: 'Chennai Traffic Impact Calculator',
      description: 'Support our mission',
      image: '/icon-192.png',
      handler: function (response: any) {
        // Verify payment on backend before success
        apiRequest('POST', '/api/verify-payment', {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          amount: Math.round(numericAmount * 100)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Payment verified - redirect to thank you page
            window.location.href = '/thank-you';
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        })
        .catch(err => {
          console.error('Payment verification failed:', err);
          alert('Payment verification failed. Please contact support.');
        });
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
          setShowAmountInput(false);
          setAmount('');
        }
      },
      notes: {
        source: 'Chennai Traffic Calculator',
        timestamp: new Date().toISOString()
      }
    };

    // Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleButtonClick = () => {
    if (!showAmountInput) {
      setShowAmountInput(true);
    }
  };

  if (showAmountInput) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-slate-600 mb-2">Enter donation amount:</div>
        <div className="flex gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <button 
            onClick={handleDonation}
            disabled={isLoading || !razorpayKey || !amount}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-md transition-colors shadow-sm hover:shadow-md"
          >
            <HeartHandshake className="h-4 w-4" />
            Donate
          </button>
          <button 
            onClick={() => {
              setShowAmountInput(false);
              setAmount('');
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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
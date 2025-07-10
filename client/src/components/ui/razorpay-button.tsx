export function RazorpayButton() {
  return (
    <>
      {/* Direct HTML from Razorpay - using React Fragment */}
      <form>
        <script 
          src="https://checkout.razorpay.com/v1/payment-button.js" 
          data-payment_button_id="pl_QrJvlLCM3GeHbV" 
          async
        >
        </script>
      </form>
    </>
  );
}
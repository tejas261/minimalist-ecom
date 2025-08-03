export default function CheckoutCancelPage() {
  return (
    <div className="max-w-xl mx-auto py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-8">
        Your payment was cancelled. You can try again or continue shopping.
      </p>
      <a href="/checkout" className="text-primary underline mr-4">
        Try Again
      </a>
      <a href="/products" className="text-primary underline">
        Continue Shopping
      </a>
    </div>
  );
}

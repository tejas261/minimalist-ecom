export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-xl mx-auto py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
      <p className="text-muted-foreground mb-8">
        Your payment was successful. You will receive an email confirmation
        shortly.
      </p>
      <a href="/products" className="text-primary underline">
        Continue Shopping
      </a>
    </div>
  );
}

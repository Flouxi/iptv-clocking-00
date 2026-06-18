import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  productSlug: string;
  productName: string;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({
  productSlug,
  productName,
  className = '',
  children = 'Buy Now',
}: CheckoutButtonProps) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const checkoutMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSlug,
          customerEmail: email || undefined,
          origin: window.location.origin,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    },
  });

  const handleClick = () => {
    setShowEmailInput(true);
  };

  const handleCheckout = () => {
    checkoutMutation.mutate(customerEmail);
  };

  if (showEmailInput) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <input
          type="email"
          placeholder="your@email.com"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="px-3 py-2 border border-input rounded-md text-sm"
          disabled={checkoutMutation.isPending}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending || !customerEmail}
            variant="default"
            className="flex-1"
          >
            {checkoutMutation.isPending ? 'Processing...' : 'Checkout'}
          </Button>
          <Button
            onClick={() => {
              setShowEmailInput(false);
              setCustomerEmail('');
            }}
            disabled={checkoutMutation.isPending}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
        {checkoutMutation.error && (
          <p className="text-xs text-red-600">
            {checkoutMutation.error instanceof Error
              ? checkoutMutation.error.message
              : 'An error occurred'}
          </p>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={checkoutMutation.isPending}
      className={className}
    >
      {children}
    </Button>
  );
}

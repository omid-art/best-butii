"use client";

import { CartProvider } from "@/context/cart-context";
import { PaymentProvider } from "@/context/payment-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <PaymentProvider>
        {children}
      </PaymentProvider>
    </CartProvider>
  );
}

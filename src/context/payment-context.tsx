"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PaymentItem = {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
};

export type PaymentData = {
  items: PaymentItem[];
  totalPrice: number;
  tax: number;
  finalPrice: number;
  merchant: string;
  orderId: string;
};

type PaymentContextType = {
  paymentData: PaymentData | null;
  setPaymentData: (data: PaymentData) => void;
};

// مقدار پیش‌فرض undefined
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Hook امن
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  return (
    <PaymentContext.Provider value={{ paymentData, setPaymentData }}>
      {children}
    </PaymentContext.Provider>
  );
};

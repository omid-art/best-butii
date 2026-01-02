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
  orderId: number;
};

type PaymentStatus = "idle" | "success" | "failed";

type PaymentContextType = {
  paymentData: PaymentData | null;
  paymentStatus: PaymentStatus;
  setPaymentData: (data: PaymentData) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  clearPayment: () => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");

  const clearPayment = () => {
    setPaymentData(null);
    setPaymentStatus("idle");
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentData,
        paymentStatus,
        setPaymentData,
        setPaymentStatus,
        clearPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

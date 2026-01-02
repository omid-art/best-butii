"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePayment } from "@/context/payment-context";
import { useCart } from "@/context/cart-context";

export default function PaymentSuccess() {
  const router = useRouter();
  const { paymentData } = usePayment();
  const { finalizeOrder } = useCart();

  useEffect(() => {
    if (!paymentData) {
      router.replace("/");
      return;
    }

    finalizeOrder(paymentData);
  }, []);

  if (!paymentData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <div className="text-4xl">✅</div>
        <h1 className="text-2xl mt-3">پرداخت موفق</h1>
        <p className="mt-2">
          شماره سفارش: <b>{paymentData.orderId}</b>
        </p>
        <p className="mt-2">
          مبلغ: <b>{paymentData.finalPrice.toLocaleString()} تومان</b>
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    </div>
  );
}

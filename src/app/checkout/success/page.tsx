"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePayment } from "@/context/payment-context";

export default function PaymentSuccess() {
  const router = useRouter();
  const { paymentData } = usePayment();

  useEffect(() => {
    // اگه کسی مستقیم این صفحه رو باز کرد
    if (!paymentData) {
      router.replace("/");
    }
  }, [paymentData, router]);

  if (!paymentData) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white"
      dir="rtl"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <div className="text-4xl">✅</div>

        <h1 className="text-2xl font-bold mt-3 text-green-700">
          پرداخت با موفقیت انجام شد
        </h1>

        <p className="mt-3 text-gray-700">
          فروشگاه:{" "}
          <span className="font-semibold">{paymentData.merchant}</span>
        </p>

        <p className="mt-1 text-gray-700">
          مبلغ:{" "}
          <span className="font-semibold">
            {paymentData.finalPrice.toLocaleString()} تومان
          </span>
        </p>

        <p className="mt-1 text-gray-700">
          شماره سفارش:{" "}
          <span className="font-mono">{paymentData.orderId}</span>
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-md bg-purple-600 text-white"
          >
            بازگشت به فروشگاه
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border"
          >
            مشاهده سفارش
          </button>
        </div>
      </div>
    </div>
  );
}

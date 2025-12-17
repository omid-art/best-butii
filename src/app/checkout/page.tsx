"use client";

import PaymentPage from "@/components/pages/checkout/checkout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import Navbar from "@/components/navbar";


export default function Page() {
  const { cart } = useCart();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<null | {
    items: { id: string; title: string; price: number; quantity: number }[];
    totalPrice: number;
    tax: number;
    finalPrice: number;
    merchant: string;
    orderId: string;
  }>(null);

  useEffect(() => {
    // فقط اگر paymentData هنوز ساخته نشده و cart خالی نیست اجرا بشه
    if (paymentData || cart.length === 0) {
      if (cart.length === 0) router.push("/products");
      return;
    }

    const totalPrice = cart.reduce(
      (sum, item) =>
        sum + Number(item.price.replace(/[^0-9]/g, "")) * item.quantity,
      0
    );
    const tax = Math.round(totalPrice * 0.09);
    const finalPrice = totalPrice + tax;

    const data = {
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: Number(item.price.replace(/[^0-9]/g, "")),
        quantity: item.quantity,
      })),
      totalPrice,
      tax,
      finalPrice,
      merchant: "NextShop",
      orderId:
        "NS-" + Math.floor(Math.random() * 1e6).toString().padStart(6, "0"),
    };

    // setState داخل setTimeout با 0 delay باعث میشه render اول کامل انجام بشه
    setTimeout(() => setPaymentData(data), 0);
  }, [cart, router, paymentData]);

  if (!paymentData) return null;

  return(<>
  <Navbar />
     <PaymentPage paymentData={paymentData} key={paymentData.orderId} />
     </>
    );
}

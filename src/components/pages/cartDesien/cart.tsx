"use client";

import Navbar from "@/components/navbar";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePayment } from "../../../context/payment-context";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { setPaymentData } = usePayment();


  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const toNumberPrice = (price: string) => Number(price.replace(/[^0-9]/g, ""));

  const totalPrice = cart.reduce(
    (sum, item) => sum + toNumberPrice(item.price) * item.quantity,
    0
  );

  const tax = Math.round(totalPrice * 0.09);
  const finalPrice = Math.round(totalPrice * 1.09);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePayment = () => {
    const paymentData = {
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: toNumberPrice(item.price),
        quantity: item.quantity,
      })),
      totalPrice,
      tax,
      finalPrice,
      merchant: "NextShop",
      orderId:
        "NS-" +
        Math.floor(Math.random() * 1e6)
          .toString()
          .padStart(6, "0"),
    };

    setPaymentData(paymentData);
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-gray-500 text-lg mb-4">سبد خرید شما خالی است 🛒</p>
          <Link
            href="/products"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 flex flex-col md:flex-row gap-8 md:items-start">
        {/* سمت راست: محصولات */}
        <div className="md:flex-2 flex flex-col gap-6 w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">سبد خرید شما</h1>

          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-900 border border-gray-200 rounded-3xl p-4 md:p-5 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row items-center gap-5">
                  {/* تصویر */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 blur opacity-20" />
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border bg-white shadow-inner">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={120}
                        height={120}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  {/* اطلاعات */}
                  <div className="flex-1 w-full">
                    <h3 className="font-bold text-lg md:text-xl text-white line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
                      <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {item.price} تومان
                      </span>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-neutral-600 rounded-full px-3 py-1 gap-3 shadow-inner">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-200 transition"
                          >
                            −
                          </button>

                          <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                key={item.quantity}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute font-bold text-white"
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                          </div>

                          <button
                            onClick={() => increaseQty(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-200 transition"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 bg-neutral-600 p-3 rounded-3xl text-sm font-semibold hover:text-red-600 hover:bg-neutral-500 transition"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* خلاصه و پرداخت */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-[340px] w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl p-4 shadow-[0_20px_30px_rgba(0,0,0,0.6)] border border-neutral-700 sticky top-28"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-xl">خلاصه خرید</h2>
            <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full flex flex-row-reverse">
              {totalQuantity} <span className="mr-1"> عدد محصول </span>
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>{totalPrice.toLocaleString()} تومان</span>
              <span>جمع کالاها</span>
            </div>

            <div className="flex justify-between">
              <span>هزینه ارسال</span>
              <span className="text-green-400">رایگان</span>
            </div>

            <div className="flex justify-between">
              <span>{tax.toLocaleString()} تومان</span>
              <span>مالیات (۹٪)</span>
            </div>

            <div className="h-px bg-neutral-700 my-2" />

            <div className="flex justify-between text-white font-bold text-base">
              <span>{finalPrice.toLocaleString()} تومان</span>
              <span>مبلغ نهایی</span>
            </div>
          </div>
          <motion.button
            onClick={handlePayment}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-all"
          >
            پرداخت و تکمیل خرید
          </motion.button>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
            <span>✔ پرداخت امن</span>
            <span>✔ تضمین اصالت</span>
            <span>✔ ارسال سریع</span>
            <span>✔ بازگشت ۷ روزه</span>
          </div>
        </motion.div>
      </div>
    </>
  );
}

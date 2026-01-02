"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  orderId: string;
  items: OrderItem[];
  totalPrice: number;
  tax: number;
  finalPrice: number;
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        router.replace("/login");
        return;
      }

      const res = await fetch("http://localhost:5005/users");
      const users = await res.json();
      const user = users.find((u: any) => u.username === username);

      if (!user) return;

      setOrders(user.orders || []);
      setLoading(false);
    };

    loadOrders();
  }, []);

  if (loading) {
    return (<>
        <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-500">
          در حال بارگذاری سفارش‌ها...
        </p>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-12"
      dir="rtl"
    >
      <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-12">
        📦 سفارش‌های من
      </h1>

      {orders.length === 0 ? (
        <div className="max-w-md mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-10 text-center shadow">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-gray-700">هیچ سفارشی ثبت نشده</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl"
          >
            شروع خرید
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {orders.map((order, index) => (
            <div
              key={index}
              className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-purple-100 hover:shadow-2xl transition"
            >
              {/* شماره سفارش */}
              <div className="absolute top-4 left-4 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-mono">
                {order.orderId}
              </div>

              <h3 className="text-lg font-bold text-purple-700 mb-3">
                سفارش #{index + 1}
              </h3>

              {/* لیست محصولات */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white/80 rounded-xl px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-700 line-clamp-1">
                      {item.title}
                    </span>

                    <span className="bg-purple-600/10 text-purple-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                      × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* جمع‌ها */}
              <div className="border-t pt-3 space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>جمع کالاها</span>
                  <span>{order.totalPrice.toLocaleString()} تومان</span>
                </div>

                <div className="flex justify-between">
                  <span>مالیات</span>
                  <span>{order.tax.toLocaleString()} تومان</span>
                </div>

                <div className="flex justify-between font-bold text-gray-900">
                  <span>مبلغ نهایی</span>
                  <span>
                    {order.finalPrice.toLocaleString()} تومان
                  </span>
                </div>
              </div>

              {/* تعداد کل */}
              <div className="mt-4 text-xs text-center text-gray-500">
                مجموع تعداد کالاها:{" "}
                <b>
                  {order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

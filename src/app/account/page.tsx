"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";

type User = {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  location: string;
  age: string;
  gender: string;
  username: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
  cart: any[];
  orders: any[];
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5005/users");
        const users: User[] = await res.json();

        const currentUser = users.find((u) => u.username === username);
        if (!currentUser) return;

        setUser(currentUser);
        setLoading(false);
      } catch (err) {
        console.error("Error loading user:", err);
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-500">
          در حال بارگذاری اطلاعات...
        </p>
      </div>
    );
  }

  if (!user) return null;

  const totalOrders = user.orders.length;
  const totalProducts = user.orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((s: number, i: any) => s + i.quantity, 0),
    0
  );

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8"
        dir="rtl"
      >
        <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-10">
          👤 حساب کاربری
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* اطلاعات اصلی */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-purple-100 hover:shadow-2xl transition">
            <h2 className="text-xl font-bold text-purple-700 mb-3">
              اطلاعات شخصی
            </h2>
            <p>
              <b>نام:</b> {user.firstName}
            </p>
            <p>
              <b>نام خانوادگی:</b> {user.lastName}
            </p>
            <p>
              <b>شماره تماس:</b> {user.phone}
            </p>
            <p>
              <b>تاریخ تولد:</b> {user.birthDate}
            </p>
            <p>
              <b>محل سکونت:</b> {user.location}
            </p>
            <p>
              <b>سن:</b> {user.age}
            </p>
            <p>
              <b>جنسیت:</b> {user.gender}
            </p>
          </div>

          {/* اطلاعات حساب */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-purple-100 hover:shadow-2xl transition">
            <h2 className="text-xl font-bold text-purple-700 mb-3">
              اطلاعات حساب
            </h2>
            <p>
              <b>نام کاربری:</b> {user.username}
            </p>
            <p>
              <b>نقش:</b> {user.isAdmin ? "ادمین" : "کاربر عادی"}
            </p>
            <p>
              <b>سبد خرید فعلی:</b> {user.cart.length} کالا
            </p>
            <p>
              <b>تعداد سفارش‌ها:</b> {totalOrders}
            </p>
            <p>
              <b>تعداد کل محصولات خریداری شده:</b> {totalProducts}
            </p>
          </div>

          {/* سفارش‌ها */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-purple-100 hover:shadow-2xl transition">
            <Link href="/orders">
              <h2 className="text-xl font-bold text-purple-700 mb-3">
                سفارش‌ها
              </h2>
              {totalOrders === 0 ? (
                <p className="text-gray-700">هیچ سفارشی ثبت نشده</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {user.orders.map((order, idx) => (
                    <div
                      key={idx}
                      className="bg-purple-50/50 rounded-xl p-2 flex justify-between items-center"
                    >
                      <span className="font-bold text-purple-700">
                        سفارش #{idx + 1}
                      </span>
                      <span className="text-sm text-gray-700">
                        {order.items.reduce(
                          (s: number, i: any) => s + i.quantity,
                          0
                        )}{" "}
                        کالا
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* دکمه برگشت به فروشگاه */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
          >
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    </>
  );
}

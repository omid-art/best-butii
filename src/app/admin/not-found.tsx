"use client";

import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white px-4">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-600/20 border border-purple-500">
            <span className="text-4xl">🚫</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-4 text-purple-400">
          دسترسی غیرمجاز
        </h1>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-6">
          شما اجازه دسترسی به <span className="text-purple-400 font-semibold">پنل ادمین</span> را ندارید.
          <br />
          این بخش فقط برای کاربرانی در دسترس است که دارای
          <span className="text-purple-400 font-semibold"> سطح دسترسی مدیر </span>
          باشند.
        </p>

        <div className="bg-black/30 rounded-xl p-4 text-sm text-gray-400 mb-8 leading-relaxed">
          اگر فکر می‌کنید این یک اشتباه است:
          <ul className="mt-2 space-y-1">
            <li>• مطمئن شوید با حساب ادمین وارد شده‌اید</li>
            <li>• دوباره وارد حساب کاربری خود شوید</li>
            <li>• یا با پشتیبانی سیستم تماس بگیرید</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-medium"
          >
            بازگشت به صفحه اصلی
          </Link>

          <Link
            href="/login"
            className="px-6 py-2 rounded-xl border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition font-medium"
          >
            ورود با حساب دیگر
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-gray-500">
          خطای دسترسی | Admin Area Protection
        </p>
      </div>
    </div>
  );
}

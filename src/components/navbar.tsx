"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Home,
  Gift,
  Layers,
  Mail,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/register"];
  if (hiddenRoutes.includes(pathname)) return null;

  // Sticky navbar
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load auth state
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("isAdmin", "false");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const checkLogin = () => {
    if (!isLoggedIn) {
      alert("برای استفاده از این بخش ابتدا باید وارد حساب شوید");
      return false;
    }
    return true;
  };

  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username") || "کاربر"
      : "کاربر";

  return (
    <nav
      className={`w-full z-50 transition-all duration-500 ${
        isSticky ? "fixed top-0 left-0" : "relative"
      }`}
    >
      <div
        className={`backdrop-blur-xl bg-white/70 w-[80%] mx-auto px-6 
        transition-all border-gray-300 
        ${
          isSticky
            ? "mt-0 scale-[0.98] rounded-3xl py-3 shadow-lg"
            : "mt-6 rounded-3xl py-4 shadow-lg"
        }
        `}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            {/* LEFT BUTTONS */}
            <div className="flex items-center gap-4 text-sm font-medium">
              {/* CART */}
              <button
                onClick={() => {
                  if (checkLogin()) window.location.href = "/cart";
                }}
                className="relative px-4 py-2 rounded-2xl 
                bg-[#e64d97]/20 backdrop-blur-xl border border-white/30
                flex items-center gap-2 text-[#7a076e] 
                hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart size={20} />
                <span>سبد خرید</span>
              </button>

              {/* LOGIN / USER */}
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-2xl 
                  bg-[#e64d97]/20 backdrop-blur-xl border border-white/30
                  flex items-center gap-2 text-[#7a076e]
                  hover:scale-105 transition-all duration-300"
                >
                  <User size={20} />
                  <span>ورود / ثبت نام</span>
                </Link>
              ) : (
                <div className="relative flex items-center gap-2" ref={menuRef}>
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-11 h-11 flex items-center justify-center 
                      bg-[#e64d97]/20 text-[#7a076e] rounded-full 
                      border cursor-pointer hover:scale-105 transition"
                  >
                    <User size={22} />
                  </div>

                  {/* Username */}
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>

                  {/* Dropdown */}
                  {menuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-52 bg-white shadow-xl 
    rounded-xl p-3 z-50 border"
                    >
                      <Link
                        href="/account"
                        className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg"
                      >
                        <User size={18} />
                        حساب کاربری
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg"
                      >
                        📦 سفارش‌های من
                      </Link>

                      <Link
                        href="/favorites"
                        className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg"
                      >
                        🤍 علاقه‌مندی‌ها
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 mt-1 p-3 hover:bg-gray-100 rounded-lg text-blue-600 font-bold"
                        >
                          🛠 پنل ادمین
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 p-3 w-full hover:bg-gray-100 rounded-lg text-red-600"
                      >
                        <LogOut size={18} />
                        خروج
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">
              {/* SEARCH */}
              <div className="hidden md:flex">
                <div className="relative rounded-3xl p-[2px] border-2 border-[#a9396fd9]">
                  <div
                    className="flex items-center bg-white/40 backdrop-blur-xl 
                    rounded-3xl px-5 py-2 w-80 shadow-lg"
                  >
                    <input
                      type="text"
                      placeholder="جستجوی محصول..."
                      className="bg-transparent outline-none px-3 text-sm w-full text-right"
                    />
                    <Search size={20} className="text-gray-500" />
                  </div>
                </div>
              </div>

              {/* LOGO */}
              <Link
                href="/"
                className="text-3xl font-extrabold tracking-wide text-[#b4107a] hover:text-[#d64ea7]"
              >
                BEST-BUTII
              </Link>
            </div>
          </div>

          {/* TABS */}
          <ul className="flex items-center justify-center gap-8 text-[15px] font-medium">
            {[
              {
                name: "ارتباط با ما",
                icon: <Mail size={16} />,
                url: "/contact",
              },
              { name: "برندها", icon: <Layers size={16} />, url: "/brands" },
              { name: "محصولات", icon: <Gift size={16} />, url: "/products" },
              { name: "خانه", icon: <Home size={16} />, url: "/" },
            ].map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-1 p-2 rounded-lg group cursor-pointer 
                hover:bg-white/40 transition"
                onClick={() => {
                  if (item.protected && !checkLogin()) return;
                  window.location.href = item.url;
                }}
              >
                <span className="text-gray-700 group-hover:text-[#d64ea7] transition">
                  {item.icon}
                </span>
                <span className="relative text-gray-700 group-hover:text-[#d64ea7] transition">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

"use client";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Home,
  Gift,
  Layers,
  Settings,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        w-full z-50 transition-all duration-300
        ${isSticky ? "fixed top-0 left-0" : "relative"}
      `}
    >
      <div
        className={`
          transition-all duration-300
          backdrop-blur-xl bg-white/70 border border-white/60
          shadow-[0_6px_20px_rgba(0,0,0,0.1)]
          
          w-[80%] mx-auto px-6
${
  isSticky
    ? "mt-0 rounded-3xl py-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    : "mt-6 rounded-3xl py-4 shadow-[0_10px_35px_rgba(0,0,0,0.12),0_0_20px_rgba(255,255,255,0.4)]"
}        `}
      >
        <div className="flex flex-col gap-3">
          {/* ---- TOP ROW ---- */}
          <div className="flex items-center justify-between w-full">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link
                href="/cart"
                className="relative px-4 py-2 rounded-2xl 
                bg-[#e64d97]/20 backdrop-blur-xl border border-white/30
                flex items-center gap-2 text-[#7a076e] 
                hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart size={20} />
                <span>سبد خرید</span>
              </Link>

              <Link
                href="/auth"
                className="px-4 py-2 rounded-2xl 
                bg-[#e64d97]/20 backdrop-blur-xl border border-white/30
                flex items-center gap-2 text-[#7a076e] 
                hover:scale-105 transition-all duration-300"
              >
                <User size={20} />
                <span>ورود / ثبت نام</span>
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">
              {/* SEARCH */}
              <div className="hidden md:flex">
                <div
                  className="
      relative rounded-3xl p-[2px] 
     border-2 border-[#a9396fd9]
    "
                >
                  {/* inner glass box */}
                  <div
                    className="
        flex items-center
        bg-white/40 backdrop-blur-xl 
        rounded-3xl 
        px-5 py-2 w-80 
        shadow-[0_0_18px_rgba(230,160,180,0.3)]
        hover:shadow-[0_0_26px_rgba(230,160,180,0.45)]
        transition-all duration-300
      "
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
                className="text-3xl font-extrabold tracking-wide text-[#b4107a] hover:text-[#d64ea7] transition-all select-none"
              >
                BEST-BUTII
              </Link>
            </div>
          </div>

          {/* ---- BOTTOM TABS ---- */}
          <ul className="flex items-center justify-center gap-8 text-[15px] font-medium">
            {[
              { name: "ارتباط با ما", icon: <Mail size={16} /> },
              { name: "برندها", icon: <Layers size={16} /> },
              { name: "دسته بندی محصولات", icon: <Gift size={16} /> },
              { name: "تنظیمات", icon: <Settings size={16} /> },
              { name: "خانه", icon: <Home size={16} /> },
            ].map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-1 p-2 rounded-lg group cursor-pointer 
                transition-all duration-300 hover:bg-white/40 
                hover:backdrop-blur-xl hover:shadow-sm"
              >
                <span className="text-gray-700 group-hover:text-[#d64ea7] transition-colors">
                  {item.icon}
                </span>

                <span className="relative text-gray-700 group-hover:text-[#d64ea7] transition-colors">
                  {item.name}
                  <span className="absolute right-0 -bottom-1 h-[2px] w-0 bg-[#d64ea7] group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

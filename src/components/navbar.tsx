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

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-gradient-to-r from-[#f7e9f4] to-white shadow-sm">
      <div className="max-w-7xl mx-auto pt-4 flex flex-col gap-4">

        {/* ---- TOP ROW ---- */}
        <div className="flex items-center justify-between w-full">

          {/* LEFT SIDE — Cart + Login */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/cart"
              className="relative p-2 rounded-2xl bg-[#e7a7b1] flex items-center gap-2 text-gray-800 hover:text-[#322b33] transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart size={20} />
              <span>سبد خرید</span>
            </Link>

            <Link
              href="/auth"
              className="flex p-2 rounded-2xl bg-[#e7a7b1] items-center gap-2 text-gray-800 hover:text-[#322b33] transition-all duration-300 hover:scale-105"
            >
              <User size={20} />
              <span>ورود / ثبت نام</span>
            </Link>
          </div>

          {/* RIGHT SIDE — Logo + Search */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-[#f3edf7] rounded-xl px-4 py-2 w-96 shadow-inner focus-within:ring-2 focus-within:ring-[#d58ade] transition-all duration-300 hover:shadow-md">
              <input
                type="text"
                placeholder="جستجوی نام محصول، دسته‌بندی و ..."
                className="bg-[#de9daI8] outline-none px-2 text-sm w-full text-right placeholder-gray-500"
              />
              <Search size={20} className="text-gray-500" />
            </div>

            <Link
              href="/"
              className="text-3xl font-extrabold tracking-wide text-[#6e4a8b] select-none hover:text-[#b04ec0] transition-colors duration-300"
            >
              BEST-BUTII
            </Link>
          </div>

        </div>

        {/* ---- BOTTOM NAVIGATION ---- */}
        <ul className="flex items-center justify-center gap-8 text-[15px] font-medium pb-3">
          {[
            { name: "ارتباط با ما", icon: <Mail size={16} /> },
            { name: "برندها", icon: <Layers size={16} /> },
            { name: "دسته بندی محصولات", icon: <Gift size={16} /> },
            { name: "تنظیمات", icon: <Settings size={16} /> },
            { name: "خانه", icon: <Home size={16} /> },
          ].map((item) => (
            <li
              key={item.name}
              className="flex items-center gap-1 p-2 rounded-lg group cursor-pointer transition-all duration-300 hover:bg-[#f7e0f5] hover:shadow-sm"
            >
              <span className="text-gray-700 group-hover:text-[#e7a7b1] transition-colors">
                {item.icon}
              </span>

              <span className="relative text-gray-700 group-hover:text-[#e7a7b1] transition-colors">
                {item.name}
                <span className="absolute right-0 -bottom-1 h-[2px] w-0 bg-[#e7a7b1] group-hover:w-full transition-all duration-300 rounded-full"></span>
              </span>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  );
}

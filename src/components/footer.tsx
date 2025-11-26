"use client";

import { usePathname } from "next/navigation";
import {
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaLocationArrow,
} from "react-icons/fa";
import { FaFireFlameCurved } from "react-icons/fa6";

export default function Footer() {
   const pathname = usePathname();

  // صفحات بدون Navbar
  const hiddenRoutes = ["/login", "/register"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <footer className="w-full mt-20">
      <div
        className="w-full pt-10 pb-8 px-8 md:px-16 text-white rounded-t-[40px]"
        style={{
          background: "linear-gradient(to bottom, #eaa9b2, #bf7a84, #9d5c66)",
        }}
      >
        {/* TOP ROW */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          {/* BRAND */}
          <div className="text-center md:text-right">
            <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-xl">
              BEST–BUTII
            </h1>

            <p className="text-white/90 mt-2 text-base leading-relaxed">
              فروشگاه لاکچری لوازم آرایشی و بهداشتی زیبایی واقعی از اینجا شروع
              میشه ✨💄
            </p>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-5">
            <a className="footer-icon">
              <FaInstagram className="text-2xl" />
            </a>
            <a className="footer-icon">
              <FaTelegram className="text-2xl" />
            </a>
            <a className="footer-icon">
              <FaWhatsapp className="text-2xl" />
            </a>
          </div>
        </div>

        {/* LINKS & CONTACT */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* QUICK LINKS */}
          <div className="flex flex-col gap-3 text-lg">
            <h3 className="font-bold text-xl mb-2 drop-shadow-md">
              دسترسی سریع
            </h3>
            <a className="footer-link">خانه</a>
            <a className="footer-link">فروشگاه</a>
            <a className="footer-link">دسته‌بندی محصولات</a>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col gap-4 text-lg">
            <h3 className="font-bold text-xl mb-2 drop-shadow-md">
              ارتباط با ما
            </h3>

            <p className="footer-contact">
              <FaPhoneAlt size={16} />
              0930 000 0000
            </p>

            <p className="footer-contact">
              <FaEnvelope size={16} />
              info@bestbutii.com
            </p>

            <p className="footer-contact">
              <FaLocationArrow size={16} />
              تهران – منطقه ۳ – خیابان زیبایی
            </p>
          </div>

          {/* BEST SELLERS */}
          <div className="flex flex-col gap-3 text-lg">
            <h3 className="font-bold text-xl mb-2 drop-shadow-md">
              محبوب‌ترین محصولات 💄
            </h3>

            <div className="flex items-center gap-2 footer-product">
              <FaFireFlameCurved />
              رژ لب مخملی
            </div>

            <div className="flex items-center gap-2 footer-product">
              <FaFireFlameCurved />
              کرم پودر HD
            </div>

            <div className="flex items-center gap-2 footer-product">
              <FaFireFlameCurved />
              پرایمر مات‌کننده
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-[1px] bg-white/30 my-8"></div>

        {/* COPYRIGHT */}
        <p className="text-center text-white/80 text-sm tracking-wide">
          © 2025 BEST-BUTII — تمامی حقوق محفوظ است.
        </p>
      </div>

      <style>{`
        .footer-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: 0.3s;
        }
        .footer-icon:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.32);
        }

        .footer-link {
          cursor: pointer;
          opacity: 0.9;
          font-size: 0.95rem;
          transition: 0.3s;
        }
        .footer-link:hover {
          opacity: 1;
          text-shadow: 0 2px 6px rgba(255,255,255,0.4);
        }

        .footer-contact {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .footer-product {
          opacity: 0.9;
          font-size: 0.95rem;
          transition: 0.3s;
        }
        .footer-product:hover {
          transform: translateX(-5px);
          opacity: 1;
        }
      `}</style>
    </footer>
  );
}

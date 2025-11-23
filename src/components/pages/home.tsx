"use client";
import { useState, useEffect } from "react";
import {
  Star,
  Globe,
  ShoppingBag,
  Gift,
  Diamond,
  ChevronRight,
  ChevronLeft,
  Heart,
} from "lucide-react";

const images = ["/tablighat/1.jpg", "/tablighat/2.jpg", "/tablighat/3.jpg"];

const products = [
  {
    id: 1,
    title: "پلیور بافتنی یقه اسکی",
    price: "1,234,000",
    img: "/mahsol-fory/1.jpg",
  },
  {
    id: 2,
    title: "کت پاییزه زنانه",
    price: "2,180,000",
    img: "/mahsol-fory/2.jpg",
  },
  {
    id: 3,
    title: "شال کشمیر درجه یک",
    price: "640,000",
    img: "/mahsol-fory/3.jpg",
  },
  { id: 4, title: "هودی مخمل", price: "985,000", img: "/mahsol-fory/4.jpg" },
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const timer = setInterval(() => handleNext(), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setDirection("next");
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection("prev");
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { title: "عطر ها", icon: <Star size={32} /> },
    { title: "برندهای خاص", icon: <Globe size={32} /> },
    { title: "پرفروش‌ها", icon: <ShoppingBag size={32} /> },
    { title: "جدیدترین‌ها", icon: <Gift size={32} /> },
    { title: "ویژه‌ها", icon: <Diamond size={32} /> },
  ];

  return (
    <div className="px-4">
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto h-[300px] md:h-[420px] overflow-hidden rounded-3xl mt-6">
        <div className="relative w-full h-full">
          {images.map((img, i) => {
            let position = "translate-x-full opacity-0";
            if (i === index) position = "translate-x-0 opacity-100";
            else if (
              i === (index - 1 + images.length) % images.length &&
              direction === "next"
            )
              position = "-translate-x-full opacity-0";
            else if (i === (index + 1) % images.length && direction === "prev")
              position = "translate-x-full opacity-0";

            return (
              <div
                key={i}
                className={`absolute inset-0 bg-cover bg-center rounded-3xl transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] ${position}`}
                style={{ backgroundImage: `url(${img})` }}
              ></div>
            );
          })}
        </div>

        {/* ARROWS */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow-md backdrop-blur transition"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow-md backdrop-blur transition"
        >
          <ChevronRight size={22} />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 w-full flex justify-center gap-3">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                index === i
                  ? "bg-[#d5828f] scale-110"
                  : "bg-white/60 hover:bg-white"
              }`}
            ></div>
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION 5*/}
      <section className="mt-14 max-w-7xl mx-auto ">
        <div className="flex flex-row-reverse items-center mb-10 justify-end">
          <h2 className="text-2xl font-extrabold text-gray-800 whitespace-nowrap ml-4">
            بهترین محصولات
          </h2>
          <div className="flex-1 h-[2px] bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-9">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="
        relative w-44 aspect-square rounded-4xl cursor-pointer overflow-hidden
        shadow-xl
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-3xl
      "
              style={{
                background: "linear-gradient(to bottom, #e7a7b1, #ffffff)",
              }}
            >
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gray-100/40 flex items-center justify-center shadow-lg">
                {cat.icon}
              </div>

              <p className="absolute bottom-4 w-full text-center font-medium text-gray-800">
                {cat.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 – PRODUCT CARDS */}
      <section className="mt-28">
        {/* SECTION TITLE */}
        <div className="max-w-7xl mx-auto flex flex-row-reverse items-center mb-6 justify-end">
          <h2 className="text-2xl font-extrabold text-gray-800 whitespace-nowrap ml-4">
            پیشنهاد ویژه
          </h2>
          <div className="flex-1 h-[3px] bg-gray-300"></div>
        </div>

        {/* BACKGROUND WRAPPER */}
        <div
          className="max-w-7xl mx-auto relative bg-[#d18893] rounded-[40px] 
      pt-6 pb-6 px-6"
        >
          {/* GRID – CARDS FLOAT OUTSIDE */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8
                    translate-y-20"
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="relative border border-gray-300 w-full h-[350px] rounded-3xl 
          overflow-hidden shadow-xl bg-gray-200 cursor-pointer"
              >
                {/* PRODUCT IMAGE */}
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.img})` }}
                ></div>

                {/* DARK GRADIENT */}
                <div
                  className="absolute bottom-0 w-full h-40 bg-gradient-to-t 
            from-black/80 to-transparent p-4 flex flex-col justify-end"
                >
                  {/* LIKE BUTTON */}
                  <div
                    className="absolute top-3 right-3"
                    onClick={() => toggleLike(p.id)}
                  >
                    {likes[p.id] ? (
                      <Heart size={26} className="text-red-500 fill-red-500" />
                    ) : (
                      <Heart size={26} className="text-white" />
                    )}
                  </div>

                  <h3 className="text-white font-bold text-lg">{p.title}</h3>
                  <p className="text-gray-200 text-sm mt-1">تومان {p.price}</p>

                  <button
                    className="mt-2 bg-white text-black px-4 py-1 rounded-full 
              text-sm font-semibold w-fit self-start"
                  >
                    مشاهده و خرید
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SPACE BELOW FOR FLOATING EFFECT */}
        <div className="h-24"></div>
      </section>
    </div>
  );
}

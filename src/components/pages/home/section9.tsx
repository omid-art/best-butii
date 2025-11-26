"use client";
import Image from "next/image";

export default function BrandSection() {
  const brands = [
    "/brands/brand1.png",
    "/brands/brand2.png",
    "/brands/brand3.png",
    "/brands/brand4.png",
    "/brands/brand5.png",
    "/brands/brand6.png",
    "/brands/brand7.png",
  ];

  return (
    <section
      className="max-w-7xl mx-auto mt-28 mb-20 rounded-3xl overflow-hidden p-6"
      style={{
        background: "linear-gradient(to right, #eaa9b2, #9d5c66)",
      }}
    >
      <div className="flex flex-row-reverse items-center mb-8 justify-end">
        <h2 className="text-2xl font-extrabold text-white whitespace-nowrap ml-4">
          برندهای ما
        </h2>
        <div className="flex-1 h-[2px] bg-white/50"></div>
      </div>

      {/* BRAND ROW */}
      <div className="flex justify-between items-center gap-4 md:gap-6">
        {brands.map((src, i) => (
          <div
            key={i}
            className="flex-none w-28 h-28 md:w-32 md:h-32 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-500 ease-in-out transform hover:scale-110"
          >
            <Image
              src={src}
              alt={`brand-${i}`}
              width={120}
              height={120}
              className="object-contain rounded-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

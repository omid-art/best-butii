"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaMagic,
  FaHeart,
  FaAppleAlt,
  FaBolt,
  FaShoppingBag,
} from "react-icons/fa";

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  isLike: boolean;
  url: string;
  color: string;
  "layout-two": string;
  "layout-three": string;
  description: string;
}

interface ProductProps {
  products: Product[];
}

/**
 * Top categories with slug (used to detect active by pathname)
 */
const topCategories = [
  {
    name: "آرایشی",
    icon: <FaMagic />,
    href: "/products/makeup",
    slug: "makeup",
  },
  {
    name: "مراقبت پوست",
    icon: <FaHeart />,
    href: "/products/skin-care",
    slug: "skin-care",
  },
  {
    name: "مراقبت و زیبایی مو",
    icon: <FaAppleAlt />,
    href: "/products/hair-care-and-beauty",
    slug: "hair-care-and-beauty",
  },
  {
    name: "لوازم برقی",
    icon: <FaBolt />,
    href: "/products/electric-tools",
    slug: "electric-tools",
  },
  {
    name: "عطر و اسپری",
    icon: <FaShoppingBag />,
    href: "/products/perfume-and-spray",
    slug: "perfume-and-spray",
  },
];

/**
 * Side categories: note the slug for each parent category
 * (sub items don't necessarily need slug unless you create routes for them;
 * for visual active check we attempt a basic slug derived from the sub label)
 */
const sideCategories = [
  {
    name: "آرایشی",
    slug: "makeup",
    href: "/products/makeup",
    sub: [
      { name: "آرایش صورت", href: "/products/makeup/face-makeup" },
      {
        name: "آرایش چشم و ابرو",
        href: "/products/makeup/eye-makeup-eyebrows",
      },
      { name: "آرایش لب", href: "/products/makeup/lip-makeup" },
      { name: "آرایش ناخن", href: "/products/makeup/nail-makeup" },
      { name: "ابزار آرایشی", href: "/products/makeup/cosmetic-tool" },
    ],
  },
  {
    name: "مراقبت پوست",
    slug: "skin-care",
    href: "/products/skin-care",
    sub: [
      { name: "مراقبت از صورت", href: "/products/skin-care/facial-care" },
      { name: "پاک کننده", href: "/products/skin-care/the-cleaner" },
      {
        name: "مراقبت از ابرو و چشم",
        href: "/products/skin-care/eyebrow-eye-care",
      },
      { name: "مراقبت از بدن", href: "/products/skin-care/body-care" },
      { name: "مراقبت از لب", href: "/products/skin-care/lip-care" },
    ],
  },
  {
    name: "مراقبت و زیبایی مو",
    slug: "hair-care-and-beauty",
    href: "/products/hair-care-and-beauty",
    sub: [
      { name: "شامپو", href: "/products/hair-care-and-beauty/shampoo" },
      {
        name: "مراقبت از مو",
        href: "/products/hair-care-and-beauty/hair-care",
      },
      { name: "زیبایی مو", href: "/products/hair-care-and-beauty/hair-beauty" },
      {
        name: "ابزار آرایش مو",
        href: "/products/hair-care-and-beauty/hair-tools",
      },
    ],
  },
  {
    name: "لوازم برقی",
    slug: "electric-tools",
    href: "/products/electric-tools",
    sub: [
      { name: "ابزار سلامتی", href: "/products/electric-tools/health-tool" },
      {
        name: "ابزار برقی اصلاح مو",
        href: "/products/electric-tools/electric-hair-tool",
      },
      {
        name: "ابزار اصلاح صورت",
        href: "/products/electric-tools/correction-tool",
      },
      {
        name: "ابزار مراقبت از پوست",
        href: "/products/electric-tools/electric-care-tool",
      },
    ],
  },
  {
    name: "عطر و اسپری",
    slug: "perfume-and-spray",
    href: "/products/perfume-and-spray",
    sub: [
      {
        name: "عطر و ادکلن",
        href: "/products/perfume-and-spray/perfume-and-cologne",
      },
      { name: "اسپری بدن", href: "/products/perfume-and-spray/body-spray" },
      {
        name: "خوشبو کننده بدن",
        href: "/products/perfume-and-spray/body-splash",
      },
    ],
  },
];

const ProductComponent: React.FC<ProductProps> = ({ products }) => {
  const pathname = usePathname() || "";

  // activeCategory و setter برای سایدبار و زیر دسته‌ها
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // selectedTop: برای هایلایت کردن تاپ کتگوری‌ها (همگام با activeCategory)
  const [selectedTop, setSelectedTop] = useState<string | null>(null);

  // expanded side (کدام دسته باز باشد)
  const [expandedSide, setExpandedSide] = useState<string | null>(null);

  const [showMore, setShowMore] = useState(false);
  const visibleProducts = showMore ? products : products.slice(0, 12);

  // liked products state
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>(
    () =>
      products.reduce((acc, prod) => {
        acc[prod.id] = prod.isLike;
        return acc;
      }, {} as Record<number, boolean>)
  );

  // Toggle like
  const toggleLike = (id: number) => {
    setLikedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /**
   * Sync activeCategory / selectedTop with pathname.
   * Priority: topCategories slug match => activate that parent.
   * Otherwise, we try to match side category slug or sub-slug.
   */
  useEffect(() => {
    // try top categories first
    const topMatch = topCategories.find((c) => pathname.includes(c.slug))?.name;

    if (topMatch) {
      setSelectedTop(topMatch);
      setActiveCategory(topMatch);
      // open the corresponding side category if exists
      const sideMatch = sideCategories.find(
        (s) => s.slug && pathname.includes(s.slug)
      );
      if (sideMatch) setExpandedSide(sideMatch.name);
      return;
    }

    // try side parent slug
    const sideParentMatch = sideCategories.find((s) =>
      pathname.includes(s.slug)
    );
    if (sideParentMatch) {
      setActiveCategory(sideParentMatch.name);
      setSelectedTop(null);
      setExpandedSide(sideParentMatch.name);
      return;
    }

    // try sub slugs: create a simple slug for each sub and test
    outer: for (const s of sideCategories) {
      for (const sub of s.sub) {
        const subSlug = sub
          .replace(/\s+/g, "-")
          .normalize("NFKD")
          .replace(/[^\w\-ء-ی]/g, "")
          .toLowerCase();
        if (pathname.includes(subSlug)) {
          setActiveCategory(sub);
          setSelectedTop(s.name);
          setExpandedSide(s.name);
          break outer;
        }
      }
    }
    // If nothing matched, clear active (optional)
    // setActiveCategory(null);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main className="flex flex-col lg:flex-row gap-10 p-6 max-w-[1400px] mx-auto">
        {/* Main Content */}
        <section className="flex-1 order-1">
          {/* Top Categories */}
          <div className="flex gap-6 mb-10 overflow-x-auto pb-2 justify-center">
            {topCategories.map((cat) => (
              <Link
                href={cat.href}
                key={cat.name}
                onClick={() => {
                  setSelectedTop(cat.name);
                  setActiveCategory(cat.name); // keep in sync when user clicks a top category
                }}
                className={`flex flex-col p-4 justify-center items-center w-48 h-40 border-2 rounded-2xl transition-all duration-200 shadow-sm
                ${
                  selectedTop === cat.name
                    ? "bg-[#d18893] text-white border-[#b4107a] scale-[1.05]"
                    : "bg-white text-[#b4107a] hover:bg-[#d18893] hover:text-white"
                }
                `}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="font-bold text-base">{cat.name}</span>
              </Link>
            ))}
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleProducts.map((prod) => (
              <div
                key={prod.id}
                className="relative w-full h-[350px] rounded-3xl overflow-hidden shadow-lg cursor-pointer group bg-gray-800 border-2 transform transition-transform duration-300 hover:scale-105 hover:border-none"
              >
                {/* Product Image */}
                <div
                  className="absolute top-0 w-full h-[70%] bg-cover bg-center transition-transform duration-300"
                  style={{ backgroundImage: `url(${prod.url})` }}
                ></div>

                {/* Bottom */}
                <div className="absolute bottom-0 w-full h-[30%]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#98626a] via-[#d18893] to-[#de98a2]" />

                  <div className="absolute inset-0 px-4 pb-3 flex flex-col justify-end text-right space-y-1">
                    <button
                      onClick={() => toggleLike(prod.id)}
                      className="absolute top-3 left-3 z-20 text-xl"
                    >
                      <span
                        className={`inline-block ${
                          likedProducts[prod.id]
                            ? "text-red-500 animate-heart-beat"
                            : "text-white"
                        }`}
                      >
                        {likedProducts[prod.id] ? "❤️" : "🤍"}
                      </span>
                    </button>

                    <div className="flex flex-col z-10">
                      <h3 className="text-white font-bold text-[14px] line-clamp-1">
                        {prod.name}
                      </h3>
                      <span className="text-gray-100 text-[12px]">
                        {prod.brand} : برند
                      </span>
                    </div>

                    <p className="text-gray-100 text-[11px] line-clamp-2 z-10">
                      {prod.description}
                    </p>

                    <div className="flex items-center justify-between mt-1 z-10">
                      <p className="text-gray-100 font-semibold text-[12px]">
                        {prod.price} تومان
                      </p>
                      <button className="bg-white text-black px-3 py-1 rounded-full text-[11px] font-semibold hover:bg-gray-100">
                        مشاهده جزئیات
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More */}
          {products.length > 12 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowMore(!showMore)}
                className="px-6 py-3 border border-[#da8995cf] text-[#820d59] font-semibold rounded-lg hover:bg-[#da8995cf] hover:text-white transition-all"
              >
                {showMore ? "بستن" : "نمایش بیشتر"}
              </button>
            </div>
          )}
        </section>

        {/* Sidebar Filter */}
        <aside className="w-full lg:w-64 flex-shrink-0 order-2">
          <div className="border rounded-xl shadow-sm p-5">
            <h3 className="font-bold mb-6 text-[#b4107a] text-lg text-center">
              فیلتر ها و دسته بندی ها
            </h3>

            {sideCategories.map((cat) => {
              const isActiveParent =
                activeCategory === cat.name || pathname.includes(cat.slug);

              return (
                <div key={cat.name} className="mb-4 text-right">
                  {/* Parent Category Link */}
                  <Link
                    href={cat.href}
                    onClick={() => {
                      setExpandedSide(
                        expandedSide === cat.name ? null : cat.name
                      );
                      setActiveCategory(cat.name);
                      const topMatch = topCategories.find(
                        (t) => t.slug === cat.slug
                      );
                      if (topMatch) setSelectedTop(topMatch.name);
                    }}
                    className={`w-full text-right font-semibold p-3 rounded-lg transition-all relative group inline-block
              ${
                isActiveParent
                  ? "bg-[#f7d8dd] text-[#b4107a]"
                  : "bg-white text-gray-800 hover:bg-[#f7d8dd] hover:text-[#b4107a]"
              }
            `}
                  >
                    {cat.name}

                    {/* Underline: scale animation */}
                    <span
                      className={`absolute bottom-1 right-3 h-[2px] bg-[#b4107a] transition-transform duration-300 origin-right transform
                ${
                  isActiveParent
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
                      style={{ width: "60%" }}
                    />
                  </Link>

                  {/* Sub List */}
                  {expandedSide === cat.name && (
                    <ul className="pr-3 mt-2 space-y-2 text-sm">
                      {cat.sub.map((sub) => {
                        const isActiveSub = pathname.includes(sub.href);

                        return (
                          <li
                            key={sub.name}
                            className="relative group cursor-pointer"
                          >
                            <Link
                              href={sub.href}
                              onClick={() => {
                                setActiveCategory(sub.name);
                                setExpandedSide(cat.name);
                                const topMatch = topCategories.find(
                                  (t) => t.slug === cat.slug
                                );
                                if (topMatch) setSelectedTop(topMatch.name);
                              }}
                              className={`w-full text-right block py-1 px-1 rounded transition-colors duration-200
            ${
              isActiveSub
                ? "bg-[#f9dbe1] text-[#ce2894]"
                : "text-gray-700 hover:bg-[#f9dbe1] hover:text-[#c51e8b]"
            }`}
                            >
                              {sub.name}

                              {/* animated underline */}
                              <span
                                className={`absolute bottom-1 right-0 h-[2px] bg-[#ea58b7] transition-transform duration-300 origin-right transform
              ${
                isActiveSub
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              }`}
                                style={{ width: "60%" }}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </main>
    </>
  );
};

export default ProductComponent;

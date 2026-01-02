"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { useCart, FavoriteItem } from "@/context/cart-context";
import { motion } from "framer-motion";

export  function FavoritesPage() {
  const { favorites, removeFromFavorites } = useCart();
  const [loading, setLoading] = useState(true);
  const [favProducts, setFavProducts] = useState<FavoriteItem[]>([]);

  // گرفتن اطلاعات کامل محصولات
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        // فرض می‌کنیم favorites از کانتکس کامل هستند
        setFavProducts(favorites);
      } catch (error) {
        console.error("خطا در بارگذاری علاقه‌مندی‌ها:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        در حال بارگذاری علاقه‌مندی‌ها...
      </div>
    );
  }

  if (favProducts.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen text-gray-500 text-lg">
          <p>💜 هنوز هیچ محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">
          علاقه‌مندی‌های شما
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-3xl overflow-hidden relative flex flex-col"
            >
              {/* تصویر محصول */}
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* اطلاعات محصول */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
                    {product.title}
                  </h2>
                  {product.price && (
                    <p className="text-red-500 font-semibold text-lg">
                      {product.price} تومان
                    </p>
                  )}
                </div>

                {/* دکمه حذف */}
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="mt-4 w-full py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all"
                >
                  حذف از علاقه‌مندی‌ها
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

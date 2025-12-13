"use client";
import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ برای بازگشت به صفحه قبل

export interface Product {
  id: number | string;
  name: string;
  brand: string;
  price: string;
  isLike: boolean;
  url: string;
  color: string;
  "layout-two": string;
  "layout-three": string;
  description: string;
  category: string;
}

interface ProductProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetails({
  product,
  relatedProducts,
}: ProductProps) {
  const [added, setAdded] = useState(false);
  const router = useRouter(); // ✅ استفاده از useRouter

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleGoBack = () => {
    router.back(); // ✅ رفتن به صفحه قبل
  };

  useEffect(() => {
    setAdded(false);
  }, [product]);

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
    <>
      <Navbar />

      <motion.div
        className="w-full mt-10 px-4 md:px-20"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Main Product Section */}
        <motion.div className="grid grid-cols-12 gap-8 mt-10">
          {/* Cart Box */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.06,
              boxShadow: "0px 20px 40px rgba(0,0,0,0.4)",
            }}
            className="col-span-12 md:col-span-3 bg-gradient-to-br from-green-400 to-green-600 shadow-2xl rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden"
          >
            <motion.div
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white rounded-3xl mix-blend-overlay pointer-events-none"
            />

            <div className="space-y-2 text-sm font-semibold z-10 relative">
              <p className="text-lg">✔ ضمانت اصالت و سلامت کالا</p>
              <p className="text-lg">✔ امکان بازگشت کالا</p>
              <p className="text-lg">✔ ارسال 3 تا 10 روزه</p>
            </div>

            <motion.button
              disabled={added}
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              className={`w-full mt-4 py-3 rounded-xl font-bold transition-all duration-300 z-10 relative ${
                added
                  ? "bg-gray-300 cursor-not-allowed text-gray-800"
                  : "bg-white text-green-600 hover:bg-green-100"
              }`}
            >
              {added ? "✔ اضافه شد" : "➕ افزودن به سبد خرید"}
            </motion.button>
          </motion.div>

          {/* Product Info */}
          <motion.div
            key={product.id}
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="col-span-12 md:col-span-5 bg-white shadow-2xl rounded-3xl border border-gray-200 p-6 flex flex-col justify-between relative overflow-hidden text-right space-y-4"
          >
            <div className="flex justify-between items-center p-6 bg-purple-50 rounded-xl shadow-inner border border-purple-200">
              <p className="font-bold text-gray-800 text-xl">{product.name}</p>
              <p className="text-gray-500 font-semibold">: نام محصول </p>
            </div>

            <div className="flex justify-between items-center p-6 bg-green-50 rounded-xl shadow-inner border border-green-200">
              <p className="font-semibold text-gray-700 text-xl">
                {product.brand}
              </p>
              <p className="text-gray-500 font-semibold">: برند </p>
            </div>

            <div className="flex justify-between items-start p-6 bg-yellow-50 rounded-xl shadow-inner border border-yellow-200">
              <p className="text-gray-600 leading-7 line-clamp-6 text-xl">
                {product.description}
              </p>
              <p className="text-gray-500 font-semibold ml-2">: توضیحات </p>
            </div>

            <div className="mt-6 text-left">
              <p className="text-red-500 text-2xl font-bold">
                تومان : {product.price}
              </p>
            </div>
          </motion.div>

          {/* Product Image + Back Button */}
          <motion.div
            key={product.name}
            variants={itemVariants}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.03 }}
            className="col-span-12 md:col-span-4 flex flex-col justify-between items-center"
          >
            <div className="w-full flex-1 flex flex-col justify-between rounded-3xl overflow-hidden shadow-2xl border bg-gray-100 p-4">
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={product.url}
                  alt={product.name}
                  className="w-full h-full object-cover object-center rounded-3xl"
                />
              </div>

              {/* ✅ دکمه بازگشت */}
              <button
                onClick={handleGoBack}
                className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
              >
                بازگشت به صفحه قبل
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          key={product.id}
          className="mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <h3 className="font-bold text-2xl mb-6 text-center">محصولات مشابه</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.category}/${prod["layout-two"]}/${prod.id}`}
                className="block"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group border-2 transition-transform duration-300"
                >
                  <div className="absolute top-0 w-full h-[70%] flex items-center justify-center bg-gray-100 overflow-hidden">
                    <img
                      src={prod.url}
                      alt={prod.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="absolute bottom-0 w-full h-[30%]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#98626a] via-[#d18893] to-[#de98a2] opacity-90" />
                    <div className="absolute inset-0 px-4 pb-3 flex flex-col justify-end space-y-1">
                      <span className="text-white font-bold text-[14px] line-clamp-1">
                        {prod.name}
                      </span>
                      <span className="text-gray-100 text-[12px]">
                        برند: {prod.brand}
                      </span>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-50 font-semibold text-[12px]">
                          {prod.price} تومان
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.12 }}
                          className="bg-white text-black px-3 py-1 rounded-full text-[11px] font-semibold hover:bg-gray-100 transition-all"
                        >
                          مشاهده
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {added && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="fixed bottom-5 right-5 bg-green-500 text-white font-bold px-6 py-3 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            محصول با موفقیت به سبد خرید اضافه شد!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

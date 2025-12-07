"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ProductProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetails({
  product,
  relatedProducts,
}: ProductProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Variants اصلاح شده برای Framer Motion
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
    }, // ease به صورت cubic bezier
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
              <p>✔ ضمانت اصالت و سلامت کالا</p>
              <p>✔ امکان بازگشت کالا</p>
              <p>✔ ارسال 3 تا 10 روزه</p>
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
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="col-span-12 md:col-span-5 bg-white shadow-2xl rounded-3xl border border-gray-200 p-6 flex flex-col justify-between relative overflow-hidden text-right space-y-4"
          >
            {/* Product Name */}
            <div className="flex justify-between items-center p-6 bg-purple-50 rounded-xl shadow-inner border border-purple-200">
               <p className="font-bold text-gray-800 text-xl">{product.name}</p>
              <p className="text-gray-500 font-semibold">: نام محصول </p>
            </div>

            {/* Brand */}
            <div className="flex justify-between items-center p-6 bg-green-50 rounded-xl shadow-inner border border-green-200">
              <p className="font-semibold text-gray-700 text-xl">{product.brand}</p>
              <p className="text-gray-500 font-semibold">: برند </p>
            </div>

            {/* Description */}
            <div className="flex justify-between items-start p-6 bg-yellow-50 rounded-xl shadow-inner border border-yellow-200">
              <p className="text-gray-600 leading-7 line-clamp-6 text-xl">
                {product.description}
              </p>
              <p className="text-gray-500 font-semibold ml-2">: توضیحات </p>
            </div>

            {/* Price */}
            <div className="mt-6 text-left">
              <p className="text-red-500 text-2xl font-bold">
                {product.price} تومان
              </p>
            </div>
          </motion.div>

          {/* Product Image */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="col-span-12 md:col-span-4 flex justify-center items-center"
          >
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border bg-gray-100 flex items-center justify-center">
              <img
                src={product.url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          className="mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h3 className="font-bold text-2xl mb-6 text-center">محصولات مشابه</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <motion.div
                key={prod.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group border-2 transition-transform duration-300"
              >
                {/* Image */}
                <div className="absolute top-0 w-full h-[70%] flex items-center justify-center bg-gray-100 overflow-hidden">
                  <img
                    src={prod.url}
                    alt={prod.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Info Overlay */}
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
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Add to Cart Notification */}
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

"use client";
import { useParams } from "next/navigation";
import db from "@/data/products/product-electric-tools.json"; 
import ProductDetails from "@/components/pages/products/productDetails";

export default function Page() {
  const { id } = useParams();

  const categories = db; 
  const allProducts = Object.entries(categories)
    .flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category }))
    );

  const layoutProducts = allProducts.filter(
    (p) => p["layout-two"] === "correction-tool"
  );

  const product = layoutProducts.find((p) => p.id === Number(id));

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        محصولی با این شناسه یا layout موجود نیست 😢
      </div>
    );

  const relatedProducts = layoutProducts.filter(
    (p) => p.id !== product.id
  );

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}

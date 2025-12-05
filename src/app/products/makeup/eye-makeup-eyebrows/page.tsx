// pages/products/face-makeup/page.tsx

import ProductComponent from "@/components/pages/products/products";

async function getData() {
  const res = await fetch("http://localhost:5000/products-makeup", {
    cache: "no-store",
  });
  return res.json();
}

export default async function FaceMakeupPage() {
  const allProducts = await getData();

  const filteredProducts = allProducts.filter(
    (item: any) => item["layout-two"] === "eye-makeup-eyebrows"
  );

  return <ProductComponent products={filteredProducts} />;
}

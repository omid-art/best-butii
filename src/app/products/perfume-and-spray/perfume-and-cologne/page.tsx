import ProductComponent from "@/components/pages/products/products";

async function getData() {
  const res = await fetch("http://localhost:5004/product-perfume-and-spray", {
    cache: "no-store",
  });
  return res.json();
}

export default async function FaceMakeupPage() {
  const allProducts = await getData();

  const filteredProducts = allProducts.filter(
    (item: any) => item["layout-two"] === "perfume-and-cologne"
  );

  return <ProductComponent products={filteredProducts} />;
}

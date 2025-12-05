import ProductComponent from "@/components/pages/products/products";

async function getData() {
  const res = await fetch("http://localhost:5004/product-perfume-and-spray", {
    cache: "no-store",
  });
  return res.json();
}

export default async function PerfumeAndSpray() {
  const products = await getData();

  return <ProductComponent products={products} />;
}

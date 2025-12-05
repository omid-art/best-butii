import ProductComponent from "@/components/pages/products/products";

async function getData() {
  const res = await fetch("http://localhost:5001/product-electric-tools", {
    cache: "no-store",
  });
  return res.json();
}

export default async function electrictools() {
  const products = await getData();

  return <ProductComponent products={products} />;
}

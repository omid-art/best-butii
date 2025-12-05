import ProductComponent from "@/components/pages/products/products";

async function getData() {
  const res = await fetch("http://localhost:5000/products-makeup", {
    cache: "no-store",
  });
  return res.json();
}

export default async function MakeupPage() {
  const products = await getData();

  return <ProductComponent products={products} />;
}

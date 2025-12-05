import ProductComponent from "@/components/pages/products/products";

async function getData() {
  const res = await fetch("http://localhost:5003/products-skin-care", {
    cache: "no-store",
  });
  return res.json();
}

export default async function skincare() {
  const products = await getData();

  return <ProductComponent products={products} />;
}

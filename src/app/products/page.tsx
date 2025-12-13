import ProductComponent from "@/components/pages/products/products";

// لیست URL ها
const urls = [
  "http://localhost:5000/products-makeup",
  "http://localhost:5001/product-electric-tools",
  "http://localhost:5002/product-hair-care-beauty",
  "http://localhost:5003/products-skin-care",
  "http://localhost:5004/product-perfume-and-spray",
];

// تابع برای گرفتن داده از هر فایل و انتخاب محصولات مشخص
async function getProducts() {
  const allProducts = [];

  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i], { cache: "no-store" });
    const data = await res.json();

    // محاسبه اندیس محصولاتی که میخوایم بگیریم
    const startId = i * 10 + 1;
    const endId = startId + 9;

    const filtered = data.filter(
      (product) => product.id >= startId && product.id <= endId
    );

    allProducts.push(...filtered);
  }

  return allProducts;
}

export default async function ProductPage() {
  const products = await getProducts();

  return <ProductComponent products={products} />;
}

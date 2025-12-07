import ProductDetails from "./productDetails";

type Product = {
  id: string | number;
  name: string;
  url: string;
  price: string;
  description: string;
  brand: string;
  isLike?: boolean;
  color?: string;
  ["layout-two"]: string;
  ["layout-three"]?: string;
};

interface Props {
  id: string | number;
  data: Record<string, Product[]>;
  layoutValue: string;
}

export default function ProductDetailsPage({ id, data, layoutValue }: Props) {
  const allProducts = Object.entries(data)
    .flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category }))
    );

  // تبدیل id ورودی به رشته برای مقایسه دقیق
  const stringId = String(id);

  // پیدا کردن محصول فقط در بین محصولات layout مشخص
  const layoutProducts = allProducts.filter(
    (p) => p["layout-two"] === layoutValue
  );

  const product = layoutProducts.find((p) => String(p.id) === stringId);

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        ❌ محصولی با این شناسه یا در این دسته وجود ندارد
      </div>
    );

  const relatedProducts = layoutProducts.filter(
    (p) => String(p.id) !== stringId
  );

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}

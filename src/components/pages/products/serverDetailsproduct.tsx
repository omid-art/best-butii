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
  category: string;
};

interface Props {
  id: string | number;
  data: Record<string, Product[]>; // چون هر فایل JSON یک دسته داره
  layoutValue: string;
}

export default function ProductDetailsPage({ id, data, layoutValue }: Props) {
  const stringId = String(id);

  // همه محصولات رو به یک آرایه مسطح تبدیل کن
  const allProducts: Product[] = Object.values(data).flat();

  // پیدا کردن محصول اصلی
  const product = allProducts.find(
    (p) => String(p.id) === stringId && p["layout-two"] === layoutValue
  );

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        ❌ محصولی با این شناسه یا در این دسته وجود ندارد
      </div>
    );

  // تبدیل id به number برای TypeScript
  const productWithNumberId = { ...product, id: Number(product.id) };

  // محصولات مشابه
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.category === product.category &&
        p["layout-two"] === product["layout-two"] &&
        String(p.id) !== stringId
    )
    .map((p) => ({ ...p, id: Number(p.id) }));

  return (
    <ProductDetails
      product={productWithNumberId}
      relatedProducts={relatedProducts}
    />
  );
}

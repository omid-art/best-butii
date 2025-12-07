import ProductDetailsPage from "@/components/pages/products/serverDetailsproduct";
import db from "@/data/products/product-makeup.json";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ProductDetailsPage
      id={id}
      data={db}
      layoutValue="lip-makeup"
    />
  );
}

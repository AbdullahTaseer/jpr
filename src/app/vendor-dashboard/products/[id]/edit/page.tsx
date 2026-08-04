import Link from "next/link";
import ProductForm from "@/components/dashboard/ProductForm";

const IcoBack = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-white text-2xl font-bold">Edit Product</h1>
        <Link
          href="/vendor-dashboard/products"
          className="flex items-center gap-2 border border-white/15 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <IcoBack />
          Back
        </Link>
      </div>
      <ProductForm productId={id} />
    </div>
  );
}

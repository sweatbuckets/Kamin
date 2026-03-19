import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderSection } from "@/components/OrderSection";
import { brandCatalog, type BrandKey } from "@/config/menu-catalog";

export default async function BrandOrderPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;

  if (!(brand in brandCatalog)) {
    notFound();
  }

  const brandKey = brand as BrandKey;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f4ede3_45%,#ffffff_100%)] p-6 sm:p-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Link
          href="/order"
          className="w-fit rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-950"
        >
          Back to brands
        </Link>

        <OrderSection brandKey={brandKey} />
      </div>
    </main>
  );
}

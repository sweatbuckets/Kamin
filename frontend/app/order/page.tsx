import Image from "next/image";
import Link from "next/link";

const brandCards = [
  {
    href: "/order/starbucks",
    name: "스타벅스",
    logo: "/logos/starbucks.png",
  },
  {
    href: "/order/twosome",
    name: "투썸플레이스",
    logo: "/logos/twosome.png",
  },
  {
    href: "/order/mega",
    name: "메가커피",
    logo: "/logos/mega.png",
  },
  {
    href: "/order/hollys",
    name: "할리스",
    logo: "/logos/hollys.png",
  },
];

const emptyCards = Array.from({ length: 12 }, (_, index) => ({
  id: `empty-${index + 1}`,
}));

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f4ede3_45%,#ffffff_100%)] p-6 sm:p-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-700">
            Order
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            Choose a franchise first.
          </h1>
          <p className="text-sm text-stone-500">
            Select a brand card to move to its order page.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {brandCards.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
            >
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-stone-950/10 transition duration-300 group-hover:bg-stone-950/35" />

              <div className="relative flex h-full flex-col justify-between p-3">
                <div className="w-fit rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-stone-700">
                  Brand
                </div>

                <div className="rounded-xl bg-white/85 px-3 py-2 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-stone-950">
                    {brand.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {emptyCards.map((card) => (
            <div
              key={card.id}
              className="group aspect-square rounded-2xl border border-dashed border-stone-200 bg-white/60 p-3 transition hover:border-stone-300 hover:bg-white/90"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl bg-stone-50/80 text-center transition group-hover:bg-stone-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-stone-300 text-stone-400">
                  +
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-stone-600">
                    Coming Soon
                  </p>
                  <p className="text-xs text-stone-400">Future franchise slot</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

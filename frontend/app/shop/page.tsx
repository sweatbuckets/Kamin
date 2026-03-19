import Image from "next/image";

const featuredDrops = [
  {
    brand: "Starbucks",
    logo: "/logos/starbucks.png",
    name: "스프링 텀블러 드롭",
    category: "Limited Goods",
    price: 420,
    note: "KAMIN",
    accent: "from-emerald-800 via-emerald-700 to-lime-500",
    status: "Coming Soon",
  },
  {
    brand: "A Twosome Place",
    logo: "/logos/twosome.png",
    name: "시그니처 케이크 바우처",
    category: "Voucher",
    price: 280,
    note: "KAMIN",
    accent: "from-rose-900 via-rose-700 to-orange-400",
    status: "Preview",
  },
  {
    brand: "Mega Coffee",
    logo: "/logos/mega.png",
    name: "데일리 콤보 팩",
    category: "Bundle Reward",
    price: 160,
    note: "KAMIN",
    accent: "from-sky-900 via-cyan-700 to-cyan-400",
    status: "Coming Soon",
  },
  {
    brand: "Hollys",
    logo: "/logos/hollys.png",
    name: "멤버스 위크 패스",
    category: "Benefit Pass",
    price: 310,
    note: "KAMIN",
    accent: "from-stone-900 via-amber-800 to-yellow-600",
    status: "Preview",
  },
];

const utilityHighlights = [
  "브랜드 굿즈와 교환권을 KAMIN 토큰으로 구매",
  "시즌 한정 드롭과 멤버십형 리워드 운영",
  "제휴 브랜드별 전용 혜택 카탈로그 구성",
  "공통 토큰을 브랜드 소비 경험으로 연결",
];

const shopSignals = [
  { label: "Catalog", value: "Brand Rewards" },
  { label: "Currency", value: "KAMIN Token" },
  { label: "Mode", value: "Redeem & Claim" },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f0e6_0%,#efe1cf_42%,#fbfaf6_100%)] px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[36px] border border-stone-200 bg-white/90 shadow-[0_28px_80px_rgba(77,49,23,0.12)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6 px-7 py-8 sm:px-10 sm:py-10">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.34em] text-stone-500">
                  Kamin Shop
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                  Spend your KAMIN on
                  <br />
                  brand rewards, not just points.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                  Kamin Shop은 사용자가 적립한 KAMIN 토큰으로 브랜드 굿즈,
                  바우처, 시즌 한정 드롭을 교환하는 리워드 마켓으로 확장될
                  페이지입니다. 지금은 준비 중인 샵 화면을 먼저 구성해두고,
                  다음 단계에서 실제 상품 교환 흐름을 연결할 예정입니다.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {utilityHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-medium text-stone-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between bg-[linear-gradient(160deg,#2c2019_0%,#6a4633_58%,#d09d67_100%)] px-7 py-8 text-white sm:px-10 sm:py-10">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                  Shop Status
                </p>
                <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-sm text-white/70">Now Building</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight">
                    Token Commerce
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/80">
                    적립된 KAMIN 토큰을 실제 브랜드 리워드 구매 경험으로 전환하는
                    전용 상점 레이어를 준비 중입니다.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {shopSignals.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
                  >
                    <span className="text-sm text-white/65">{item.label}</span>
                    <span className="text-sm font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">
                Featured Drops
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Preview the first reward shelf.
              </h2>
            </div>
            <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600">
              Placeholder Catalog
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredDrops.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-sm"
              >
                <div
                  className={`h-44 bg-gradient-to-br ${item.accent} p-5 text-white`}
                >
                  <div className="flex items-center gap-3 rounded-full bg-white/15 px-3 py-2 pr-4 backdrop-blur-sm w-fit">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/90">
                      <Image
                        src={item.logo}
                        alt={`${item.brand} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
                      {item.brand}
                    </span>
                  </div>

                  <div className="mt-10">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight break-keep">
                      {item.name}
                    </h3>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      {item.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-400">
                        Redeem Price
                      </p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight text-stone-950">
                        {item.price}
                      </p>
                    </div>
                    <div className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
                      {item.note}
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white opacity-80"
                  >
                    Available Soon
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-dashed border-stone-300 bg-white/70 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">
                Next Step
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
                다음 단계에서는 실제 상품 데이터, 리딤 정책, 토큰 차감 로직,
                브랜드별 교환 완료 플로우가 이 페이지에 연결됩니다.
              </p>
            </div>
            <div className="rounded-full bg-[#ead9c3] px-4 py-2 text-sm font-semibold text-stone-800">
              Redemption Flow Pending
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

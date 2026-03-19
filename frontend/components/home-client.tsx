"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";

import { contracts } from "@/config/contracts";

type GrassDay = {
  date: string;
  count: number;
  level: number;
};

type TooltipState = {
  day: GrassDay;
  x: number;
  y: number;
};

type BrandSummary = {
  key: string;
  name: string;
  marketAddress: string;
  logoPath: string | null;
  orderCount: number;
};

const homeBrands = [
  {
    key: "starbucks",
    name: "스타벅스",
    marketAddress: contracts.starbucksMarket,
    logoPath: "/logos/starbucks.png",
  },
  {
    key: "twosome",
    name: "투썸플레이스",
    marketAddress: contracts.twosomeMarket,
    logoPath: "/logos/twosome.png",
  },
  {
    key: "mega",
    name: "메가커피",
    marketAddress: contracts.megaMarket,
    logoPath: "/logos/mega.png",
  },
  {
    key: "hollys",
    name: "할리스",
    marketAddress: contracts.hollysMarket,
    logoPath: "/logos/hollys.png",
  },
] as const;

const emptyBoard = () =>
  Array.from({ length: 42 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (41 - index));

    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    };
  });

export function HomeClient() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  const { address, chain, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
    },
  });
  const [boardCells, setBoardCells] = useState<GrassDay[]>(emptyBoard);
  const [totalOrders, setTotalOrders] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [brandSummaries, setBrandSummaries] = useState<BrandSummary[]>([]);

  useEffect(() => {
    let ignore = false;

    const loadGrass = async () => {
      if (!address) {
        setTotalOrders(0);
        setBoardCells(emptyBoard());
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/order/grass?user=${address}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch grass data");
        }

        const data = (await response.json()) as {
          totalOrders?: number;
          days?: GrassDay[];
        };

        if (!ignore) {
          setTotalOrders(data.totalOrders ?? 0);
          setBoardCells(data.days?.length ? data.days : emptyBoard());
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setTotalOrders(0);
          setBoardCells(emptyBoard());
        }
      }
    };

    loadGrass();

    return () => {
      ignore = true;
    };
  }, [address, backendUrl]);

  useEffect(() => {
    let ignore = false;

    const loadSummary = async () => {
      if (!address) {
        setBrandSummaries([]);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/order/summary?user=${address}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch summary data");
        }

        const data = (await response.json()) as { brands?: BrandSummary[] };

        if (!ignore) {
          setBrandSummaries(data.brands ?? []);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setBrandSummaries([]);
        }
      }
    };

    loadSummary();

    return () => {
      ignore = true;
    };
  }, [address, backendUrl]);

  const mergedBrandCards = homeBrands.map((brand) => {
    const summary = brandSummaries.find((item) => item.key === brand.key);

    return {
      key: brand.key,
      name: brand.name,
      logoPath: summary?.logoPath ?? brand.logoPath,
      marketAddress: summary?.marketAddress ?? brand.marketAddress ?? "Not configured",
      orderCount: summary?.orderCount ?? 0,
    };
  });

  return (
    <main className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#f8f1e7_0%,#efe4d3_45%,#fffdf9_100%)] text-stone-950">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-6 rounded-[32px] border border-stone-200/80 bg-white/90 p-8 shadow-[0_30px_100px_rgba(68,38,20,0.12)] backdrop-blur sm:p-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/logos/camin_icon.png"
                  alt="Kamin logo"
                  width={64}
                  height={64}
                  className="h-14 w-14 rounded-2xl object-cover shadow-sm sm:h-16 sm:w-16"
                />
                <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
                  카페의 민족
                </h1>
              </div>
            </div>

            <div className="sm:ml-auto">
              <ConnectButton />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm font-medium text-stone-500">Connection</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {isConnected ? "Connected" : "Not connected"}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm font-medium text-stone-500">Network</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {chain?.name ?? "No network"}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm font-medium text-stone-500">Balance</p>
              <p className="mt-2 text-lg font-semibold text-stone-950">
                {balance
                  ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}`
                  : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-stone-300 bg-[linear-gradient(180deg,#faf7f2_0%,#eadfce_100%)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-700">
                  Grass Board
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-950">
                  Reward activity
                </h2>
              </div>
              <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-stone-800">
                {totalOrders} orders
              </div>
            </div>

            <div className="mt-4 text-sm text-stone-700/80">
              Hover a tile to see daily order activity.
            </div>

            <div className="relative mt-6">
              {!isConnected ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/65 backdrop-blur-[2px]">
                  <div className="rounded-2xl border border-stone-300 bg-white/90 px-5 py-4 text-center shadow-sm">
                    <p className="text-sm font-semibold text-stone-900">
                      계정 연결 후 확인 가능
                    </p>
                    <p className="mt-1 text-xs text-stone-600">
                      잔디판 활동 기록은 지갑 연결 후 표시됩니다.
                    </p>
                  </div>
                </div>
              ) : null}

              {tooltip ? (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white shadow-lg"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y - 10,
                  }}
                >
                  {tooltip.day.count === 0
                    ? `No coffee on ${tooltip.day.date}`
                    : `${tooltip.day.count} cup${tooltip.day.count > 1 ? "s" : ""} on ${tooltip.day.date}`}
                </div>
              ) : null}

              <div className="grid grid-cols-7 gap-2 sm:grid-cols-10 md:grid-cols-14">
                {boardCells.map((cell) => {
                  const styles = [
                    "bg-stone-200",
                    "bg-stone-300",
                    "bg-stone-500",
                    "bg-stone-700",
                    "bg-stone-900",
                  ];

                  return (
                    <div
                      key={cell.date}
                      onMouseEnter={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const parentRect =
                          event.currentTarget.parentElement?.getBoundingClientRect();
                        setTooltip({
                          day: cell,
                          x: rect.left - (parentRect?.left ?? 0) + rect.width / 2,
                          y: rect.top - (parentRect?.top ?? 0),
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      className={`aspect-square rounded-md border border-white/70 ${styles[cell.level]}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/order"
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Open Order Page
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mergedBrandCards.map((brand) => (
              <div
                key={brand.key}
                className="rounded-3xl border border-stone-200 bg-stone-50 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {brand.logoPath ? (
                      <Image
                        src={brand.logoPath}
                        alt={`${brand.name} logo`}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-2xl object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="text-sm font-medium text-stone-500">
                        {brand.name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-900">
                        {brand.orderCount} orders
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 break-all font-mono text-sm text-stone-700">
                  {brand.marketAddress}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

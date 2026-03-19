"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";

type HistoryItem = {
  id: number;
  orderId: number;
  menuName: string;
  rewardAmount: number;
  createdAt: string;
  brandName: string | null;
  brandKey: string | null;
};

const brandLogos: Record<string, string> = {
  starbucks: "/logos/starbucks.png",
  twosome: "/logos/twosome.png",
  mega: "/logos/mega.png",
  hollys: "/logos/hollys.png",
};

export function HistoryClient() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadHistory = async () => {
      if (!address) {
        setItems([]);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `${backendUrl}/order/history?user=${address}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }

        const data = (await response.json()) as { orders?: HistoryItem[] };

        if (!ignore) {
          setItems(data.orders ?? []);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setItems([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      ignore = true;
    };
  }, [address, backendUrl]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f4ede3_45%,#ffffff_100%)] p-6 sm:p-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="rounded-[32px] border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-700">
            History
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            Order History
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            {isConnected
              ? "Your coffee orders and reward history."
              : "Connect your wallet to load your order history."}
          </p>
        </div>

        <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
          {loading ? (
            <p className="text-sm text-stone-500">Loading history...</p>
          ) : !isConnected ? (
            <p className="text-sm text-stone-500">
              Wallet connection is required to view your order history.
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm text-stone-500">
              No order history yet.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    {item.brandKey && brandLogos[item.brandKey] ? (
                      <Image
                        src={brandLogos[item.brandKey]}
                        alt={`${item.brandName ?? item.brandKey} logo`}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-2xl object-cover"
                      />
                    ) : null}

                    <div>
                      <p className="text-lg font-semibold text-stone-950">
                        {item.brandName ?? "Unknown Brand"} · {item.menuName}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Order #{item.orderId}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#efe3d2] px-4 py-2 text-sm font-semibold text-stone-800">
                    +{item.rewardAmount} KAMIN
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

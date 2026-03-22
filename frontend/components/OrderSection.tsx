"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { parseAbi } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";

import { contracts } from "@/config/contracts";
import {
  brandCatalog,
  type BrandKey,
  type BrandMenuItem,
} from "@/config/menu-catalog";

const brandImagePrefix: Record<BrandKey, string> = {
  starbucks: "sb",
  twosome: "ts",
  mega: "mg",
  hollys: "hs",
};

const menuImageKeyMap: Partial<Record<BrandKey, Record<string, string>>> = {
  starbucks: {
    americano: "americano",
    latte: "latte",
  },
  twosome: {
    latte: "latte",
    mocha: "mocca",
  },
  mega: {
    coffee: "coffe",
    vanilla: "vanilla",
    vanillalatte: "vanilla",
  },
  hollys: {
    americano: "americano",
    vanilla: "vanilla",
    vanilladelight: "vanilla",
  },
};

const getMenuImageSrc = (brandKey: BrandKey, menuName: string) => {
  const normalizedName = menuName.toLowerCase().replace(/[^a-z]/g, "");
  const mappedName =
    menuImageKeyMap[brandKey]?.[normalizedName] ?? normalizedName;

  return `/menus/${brandImagePrefix[brandKey]}${mappedName}.png`;
};

const isUserRejectedError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as {
    code?: number;
    message?: string;
    shortMessage?: string;
    details?: string;
    cause?: unknown;
  };

  const messageParts = [
    maybeError.message,
    maybeError.shortMessage,
    maybeError.details,
    typeof maybeError.cause === "object" &&
    maybeError.cause &&
    "message" in maybeError.cause &&
    typeof maybeError.cause.message === "string"
      ? maybeError.cause.message
      : undefined,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    maybeError.code === 4001 ||
    messageParts.includes("user rejected") ||
    messageParts.includes("user denied") ||
    messageParts.includes("rejected the request")
  );
};

export function OrderSection({ brandKey }: { brandKey: BrandKey }) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<BrandMenuItem[]>(
    [...brandCatalog[brandKey].menus],
  );
  const [menuLoading, setMenuLoading] = useState(true);
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const brand = brandCatalog[brandKey];

  const kaminAbi = parseAbi([
    "function confirmOrder(address market,string menuName,uint256 orderId,uint256 rewardAmount,bytes signature)",
  ]);

  useEffect(() => {
    let ignore = false;

    const loadMenus = async () => {
      setMenuLoading(true);

      try {
        const response = await fetch(`${backendUrl}/menus?brand=${brandKey}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch menus");
        }

        const data = (await response.json()) as { menus?: BrandMenuItem[] };

        if (!ignore && data.menus?.length) {
          setMenuItems(data.menus);
          return;
        }
      } catch (error) {
        console.error(error);
      }

      if (!ignore) {
        setMenuItems([...brandCatalog[brandKey].menus]);
      }
    };

    loadMenus().finally(() => {
      if (!ignore) {
        setMenuLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [backendUrl, brandKey]);

  const handleOrder = async (menuName: string) => {
    if (!address || !brand.market || !publicClient) return;

    try {
      setLoading(menuName);

      const res = await fetch(`${backendUrl}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: address,
          market: brand.market,
          menuName,
        }),
      });

      if (!res.ok) {
        throw new Error("Order request failed");
      }

      const data = await res.json();
      const { orderId, rewardAmount, signature } = data;

      const txHash = await writeContractAsync({
        address: contracts.kamin as `0x${string}`,
        abi: kaminAbi,
        functionName: "confirmOrder",
        args: [
          brand.market as `0x${string}`,
          menuName,
          BigInt(orderId),
          BigInt(rewardAmount),
          signature as `0x${string}`,
        ],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== "success") {
        throw new Error("Transaction reverted");
      }

      const confirmRes = await fetch(`${backendUrl}/order/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: address,
          market: brand.market,
          menuName,
          orderId,
          rewardAmount,
          txHash,
        }),
      });

      if (!confirmRes.ok) {
        throw new Error("Order confirmation sync failed");
      }

      alert("Order success!");
    } catch (error) {
      console.error(error);
      if (isUserRejectedError(error)) {
        alert("Order cancelled");
      } else {
        alert("Transaction failed");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className={`${brand.theme.panel} rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 text-white`}
    >
      <div>
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{brand.name}</h2>
          </div>
        </div>
        {!brand.market ? (
          <p className="mt-2 text-sm font-medium text-amber-100">
            Contract address is not configured yet. Orders are currently unavailable.
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {menuLoading && (
            <p className="text-xs font-medium text-white/60">Loading menus...</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {menuItems.map((menu) => (
            <button
              key={`${brandKey}-${menu.name}`}
              onClick={() => handleOrder(menu.name)}
              disabled={!isConnected || !brand.market || loading === menu.name}
              className="rounded-2xl bg-white text-left text-stone-950 shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-stretch gap-4 p-4">
                <div className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl ${menu.color}`}>
                  <Image
                    src={getMenuImageSrc(brandKey, menu.name)}
                    alt={`${menu.name} image`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-stone-950">
                        {menu.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                        {menu.description}
                      </p>
                    </div>
                    <div className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${brand.theme.chip}`}>
                      {menu.pointsCost} pt
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-stone-500">{brand.name}</p>
                    <span
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${brand.theme.action} ${
                        !brand.market || loading === menu.name
                          ? "opacity-80"
                          : "hover:brightness-75"
                      }`}
                    >
                      {!brand.market
                        ? "Coming Soon"
                        : loading === menu.name
                          ? "Ordering..."
                          : "주문하기"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

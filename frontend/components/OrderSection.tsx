"use client";

import { useEffect, useState } from "react";
import { parseAbi } from "viem";
import { useAccount, useWriteContract } from "wagmi";

import { contracts } from "@/config/contracts";
import {
  brandCatalog,
  type BrandKey,
  type BrandMenuItem,
} from "@/config/menu-catalog";

export function OrderSection({ brandKey }: { brandKey: BrandKey }) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<BrandMenuItem[]>(
    brandCatalog[brandKey].menus,
  );
  const [menuLoading, setMenuLoading] = useState(true);
  const { writeContractAsync } = useWriteContract();

  const brand = brandCatalog[brandKey];

  const kaminAbi = parseAbi([
    "function confirmOrder(address market,string menuName,uint256 orderId,uint256 rewardAmount,bytes signature)",
  ]);

  useEffect(() => {
    let ignore = false;

    const loadMenus = async () => {
      setMenuLoading(true);

      try {
        const response = await fetch(`${backendUrl}/order/menus?brand=${brandKey}`, {
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
        setMenuItems(brandCatalog[brandKey].menus);
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
    if (!address || !brand.market) return;

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

      await writeContractAsync({
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

      alert("Order success!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
      <div>
        <p className="text-sm font-medium text-stone-500">Selected Brand</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-950">
          {brand.name}
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Menu prices are designed to come from the backend response format.
        </p>
        {!brand.market ? (
          <p className="mt-2 text-sm font-medium text-amber-700">
            Contract address is not configured yet. Orders are currently unavailable.
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-stone-500">Menu Board</p>
          {menuLoading && (
            <p className="text-xs font-medium text-stone-400">Loading menus...</p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {menuItems.map((menu) => (
            <button
              key={`${brandKey}-${menu.name}`}
              onClick={() => handleOrder(menu.name)}
              disabled={!isConnected || !brand.market || loading === menu.name}
              className={`${menu.color} rounded-xl p-4 text-left text-white disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{menu.name}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {menu.description}
                  </p>
                </div>
                <div className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                  {menu.pointsCost} pt
                </div>
              </div>
              <p className="mt-4 text-sm text-white/80">{brand.name}</p>
              <p className="mt-2 text-sm font-medium">
                {!brand.market
                  ? "Coming Soon"
                  : loading === menu.name
                    ? "Ordering..."
                    : "Confirm Order"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

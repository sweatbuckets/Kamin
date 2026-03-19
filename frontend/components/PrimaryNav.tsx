"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { parseAbi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { contracts } from "@/config/contracts";

const links = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/shop", label: "Kamin Shop" },
  { href: "/history", label: "History" },
];

const erc20Abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
]);

export function PrimaryNav() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

  const { data: balance } = useReadContract({
    address: contracts.kamin,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && contracts.kamin),
    },
  });

  const { data: symbol } = useReadContract({
    address: contracts.kamin,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: Boolean(contracts.kamin),
    },
  });

  const pointsValue =
    isConnected && typeof balance === "bigint"
      ? new Intl.NumberFormat("ko-KR").format(Number(balance))
      : "0";
  const pointsUnit = symbol ?? "KAMIN";

  useEffect(() => {
    if (!address) {
      return;
    }

    void fetch(`${backendUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress: address,
      }),
    }).catch((error) => {
      console.error("Failed to sync user login", error);
    });
  }, [address, backendUrl]);

  return (
    <nav className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#faf7f2]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
        <div className="flex items-center gap-2">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden rounded-full bg-stone-100 px-4 py-2 text-right sm:block">
            <p className="max-w-[180px] truncate text-sm font-medium text-stone-800">
              {address ?? "Not connected"}
            </p>
          </div>
          <div className="rounded-full bg-[#e8dcc9] px-4 py-2 text-right">
            <p className="flex items-end gap-2 text-stone-950">
              <span className="text-lg font-bold tracking-tight sm:text-xl">
                {pointsValue}
              </span>
              <span className="pb-0.5 text-xs font-medium tracking-tight text-stone-700 sm:text-sm">
                {pointsUnit}
              </span>
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

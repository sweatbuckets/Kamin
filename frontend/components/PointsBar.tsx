"use client";

import { parseAbi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { contracts } from "@/config/contracts";

const erc20Abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
]);

export function PointsBar() {
  const { address, isConnected } = useAccount();

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

  return (
    <div className="sticky top-4 z-30">
      <div className="rounded-2xl border border-amber-200 bg-[linear-gradient(180deg,#fff7ed_0%,#fffbeb_100%)] px-5 py-4 shadow-[0_12px_30px_rgba(245,158,11,0.18)] backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/80 px-4 py-2 text-left">
              <p className="text-xs font-medium text-amber-700">
                Connected Account
              </p>
              <p className="mt-1 max-w-[180px] truncate text-sm font-semibold text-amber-950 sm:max-w-[240px]">
                {address ?? "Not connected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/80 px-4 py-2 text-right">
              <p className="flex items-end gap-2 text-amber-950">
                <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {pointsValue}
                </span>
                <span className="pb-0.5 text-sm font-medium tracking-tight text-amber-800 sm:text-base">
                  {pointsUnit}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

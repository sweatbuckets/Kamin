import type { Address } from "viem";

const envAddress = (value: string | undefined) => value as Address | undefined;

export const contracts = {
  kamin: envAddress(process.env.NEXT_PUBLIC_KAMIN_ADDRESS),
  starbucksMarket: envAddress(process.env.NEXT_PUBLIC_STARBUCKS_MARKET_ADDRESS),
  twosomeMarket: envAddress(process.env.NEXT_PUBLIC_TWOSOME_MARKET_ADDRESS),
  megaMarket: envAddress(process.env.NEXT_PUBLIC_MEGA_MARKET_ADDRESS),
  hollysMarket: envAddress(process.env.NEXT_PUBLIC_HOLLYS_MARKET_ADDRESS),
} as const;

import { contracts } from "@/config/contracts";

export const brandCatalog = {
  starbucks: {
    name: "Starbucks",
    logo: "/logos/starbucks.png",
    theme: {
      panel: "bg-green-700",
      subtle: "bg-green-50",
      accent: "text-green-900",
      chip: "bg-green-100 text-green-900",
      action: "bg-green-900 text-white",
    },
    market: contracts.starbucksMarket,
    menus: [
      {
        name: "Americano",
        description: "Classic espresso with water.",
        pointsCost: 120,
        color: "bg-green-600",
      },
      {
        name: "Latte",
        description: "Smooth milk coffee for a softer taste.",
        pointsCost: 170,
        color: "bg-green-500",
      },
    ],
  },
  twosome: {
    name: "Twosome",
    logo: "/logos/twosome.png",
    theme: {
      panel: "bg-rose-700",
      subtle: "bg-rose-50",
      accent: "text-rose-950",
      chip: "bg-rose-100 text-rose-900",
      action: "bg-rose-900 text-white",
    },
    market: contracts.twosomeMarket,
    menus: [
      {
        name: "Latte",
        description: "Balanced espresso and milk.",
        pointsCost: 160,
        color: "bg-rose-700",
      },
      {
        name: "Mocha",
        description: "Chocolate-based sweet coffee.",
        pointsCost: 210,
        color: "bg-rose-600",
      },
    ],
  },
  mega: {
    name: "Mega",
    logo: "/logos/mega.png",
    theme: {
      panel: "bg-yellow-400",
      subtle: "bg-yellow-50",
      accent: "text-yellow-950",
      chip: "bg-yellow-100 text-yellow-900",
      action: "bg-yellow-900 text-white",
    },
    market: contracts.megaMarket,
    menus: [
      {
        name: "Coffee",
        description: "Large-size basic coffee.",
        pointsCost: 90,
        color: "bg-blue-600",
      },
      {
        name: "Vanilla Latte",
        description: "Sweet vanilla milk coffee.",
        pointsCost: 150,
        color: "bg-sky-500",
      },
    ],
  },
  hollys: {
    name: "Hollys",
    logo: "/logos/hollys.png",
    theme: {
      panel: "bg-stone-700",
      subtle: "bg-stone-100",
      accent: "text-stone-950",
      chip: "bg-stone-200 text-stone-900",
      action: "bg-stone-900 text-white",
    },
    market: contracts.hollysMarket,
    menus: [
      {
        name: "Americano",
        description: "Deep roasted coffee with a bold finish.",
        pointsCost: 130,
        color: "bg-stone-700",
      },
      {
        name: "Vanilla Delight",
        description: "Sweet vanilla latte with a smooth texture.",
        pointsCost: 180,
        color: "bg-stone-500",
      },
    ],
  },
} as const;

export type BrandKey = keyof typeof brandCatalog;
export type BrandMenuItem = (typeof brandCatalog)[BrandKey]["menus"][number];

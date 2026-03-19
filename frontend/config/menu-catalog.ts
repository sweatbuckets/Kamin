import { contracts } from "@/config/contracts";

export const brandCatalog = {
  starbucks: {
    name: "Starbucks",
    logo: "/logos/starbucks.png",
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

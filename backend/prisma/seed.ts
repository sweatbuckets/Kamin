import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
});

const prisma = new PrismaClient({
  adapter,
});

const brands = [
  {
    key: 'starbucks',
    name: 'Starbucks',
    marketAddress: process.env.STARBUCKS_MARKET_ADDRESS ?? '',
    logoPath: '/logos/starbucks.png',
    menus: [
      {
        name: 'Americano',
        description: 'Classic espresso with water.',
        pointsCost: 120,
        color: 'bg-green-600',
      },
      {
        name: 'Latte',
        description: 'Smooth milk coffee for a softer taste.',
        pointsCost: 170,
        color: 'bg-green-500',
      },
    ],
  },
  {
    key: 'twosome',
    name: 'Twosome',
    marketAddress: process.env.TWOSOME_MARKET_ADDRESS ?? '',
    logoPath: '/logos/twosome.png',
    menus: [
      {
        name: 'Latte',
        description: 'Balanced espresso and milk.',
        pointsCost: 160,
        color: 'bg-rose-700',
      },
      {
        name: 'Mocha',
        description: 'Chocolate-based sweet coffee.',
        pointsCost: 210,
        color: 'bg-rose-600',
      },
    ],
  },
  {
    key: 'mega',
    name: 'Mega',
    marketAddress: process.env.MEGA_MARKET_ADDRESS ?? '',
    logoPath: '/logos/mega.png',
    menus: [
      {
        name: 'Coffee',
        description: 'Large-size basic coffee.',
        pointsCost: 90,
        color: 'bg-blue-600',
      },
      {
        name: 'Vanilla Latte',
        description: 'Sweet vanilla milk coffee.',
        pointsCost: 150,
        color: 'bg-sky-500',
      },
    ],
  },
  {
    key: 'hollys',
    name: 'Hollys',
    marketAddress: process.env.HOLLYS_MARKET_ADDRESS ?? '',
    logoPath: '/logos/hollys.png',
    menus: [
      {
        name: 'Americano',
        description: 'Deep roasted coffee with a bold finish.',
        pointsCost: 130,
        color: 'bg-stone-700',
      },
      {
        name: 'Vanilla Delight',
        description: 'Sweet vanilla latte with a smooth texture.',
        pointsCost: 180,
        color: 'bg-stone-500',
      },
    ],
  },
];

async function main() {
  for (const brand of brands) {
    if (!brand.marketAddress) {
      continue;
    }

    const createdBrand = await prisma.brand.upsert({
      where: { key: brand.key },
      update: {
        name: brand.name,
        marketAddress: brand.marketAddress,
        logoPath: brand.logoPath,
      },
      create: {
        key: brand.key,
        name: brand.name,
        marketAddress: brand.marketAddress,
        logoPath: brand.logoPath,
      },
    });

    await prisma.menu.deleteMany({
      where: { brandId: createdBrand.id },
    });

    await prisma.menu.createMany({
      data: brand.menus.map((menu) => ({
        brandId: createdBrand.id,
        name: menu.name,
        description: menu.description,
        pointsCost: menu.pointsCost,
        color: menu.color,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

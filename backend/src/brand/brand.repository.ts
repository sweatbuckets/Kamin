import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSummaryByWalletAddress(walletAddress: string) {
    return this.prisma.brand.findMany({
      include: {
        _count: {
          select: {
            orders: {
              where: {
                user: {
                  walletAddress: {
                    equals: walletAddress,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findWithMenusByKey(brandKey: string) {
    return this.prisma.brand.findUnique({
      where: { key: brandKey },
    });
  }

  findWithMenuByMarketAndName(market: string, menuName: string) {
    return this.prisma.brand.findFirst({
      where: {
        marketAddress: {
          equals: market,
          mode: 'insensitive',
        },
      },
      include: {
        menus: {
          where: {
            name: menuName,
            isActive: true,
          },
          take: 1,
        },
      },
    });
  }
}

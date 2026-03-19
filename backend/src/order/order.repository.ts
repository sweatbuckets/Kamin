import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  findHistoryByWalletAddress(walletAddress: string) {
    return this.prisma.order.findMany({
      where: {
        user: {
          walletAddress: {
            equals: walletAddress,
          },
        },
      },
      include: {
        user: true,
        brand: true,
        menu: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findGrassByWalletAddress(walletAddress: string, since: Date) {
    return this.prisma.order.findMany({
      where: {
        user: {
          walletAddress: {
            equals: walletAddress,
          },
        },
        createdAt: {
          gte: since,
        },
      },
      select: {
        createdAt: true,
      },
    });
  }

  findByOrderId(orderId: number) {
    return this.prisma.order.findUnique({
      where: {
        orderId,
      },
    });
  }

  create(data: {
    userId: number;
    marketAddress: string;
    menuName: string;
    orderId: number;
    rewardAmount: number;
    brandId: number;
    menuId: number;
  }) {
    return this.prisma.order.create({
      data,
    });
  }
}

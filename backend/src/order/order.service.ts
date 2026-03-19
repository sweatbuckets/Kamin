import { BadRequestException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
  private readonly provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  private readonly kaminInterface = new ethers.Interface([
    'function confirmOrder(address market,string menuName,uint256 orderId,uint256 rewardAmount,bytes signature)',
  ]);

  async getHistory(user: string) {
    if (!user) {
      throw new BadRequestException('User address is required');
    }

    const orders = await this.prisma.order.findMany({
      where: {
        userAddress: {
          equals: user,
          mode: 'insensitive',
        },
      },
      include: {
        brand: true,
        menu: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      orders: orders.map((order) => ({
        id: order.id,
        orderId: order.orderId,
        userAddress: order.userAddress,
        marketAddress: order.marketAddress,
        menuName: order.menuName,
        rewardAmount: order.rewardAmount,
        createdAt: order.createdAt,
        brandName: order.brand?.name ?? null,
        brandKey: order.brand?.key ?? null,
      })),
    };
  }

  async getGrass(user: string) {
    if (!user) {
      throw new BadRequestException('User address is required');
    }

    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - 41);

    const orders = await this.prisma.order.findMany({
      where: {
        userAddress: {
          equals: user,
          mode: 'insensitive',
        },
        createdAt: {
          gte: since,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const countsByDate = new Map<string, number>();

    orders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 10);
      countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
    });

    const days = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(since);
      date.setDate(since.getDate() + index);

      const key = date.toISOString().slice(0, 10);
      const count = countsByDate.get(key) ?? 0;
      const level =
        count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 4;

      return {
        date: key,
        count,
        level,
      };
    });

    return {
      totalOrders: orders.length,
      days,
    };
  }

  async getSummary(user: string) {
    if (!user) {
      throw new BadRequestException('User address is required');
    }

    const brands = await this.prisma.brand.findMany({
      include: {
        _count: {
          select: {
            orders: {
              where: {
                userAddress: {
                  equals: user,
                  mode: 'insensitive',
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

    return {
      brands: brands.map((brand) => ({
        key: brand.key,
        name: brand.name,
        marketAddress: brand.marketAddress,
        logoPath: brand.logoPath,
        orderCount: brand._count.orders,
      })),
    };
  }

  async getMenus(brandKey: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { key: brandKey },
      include: {
        menus: {
          where: { isActive: true },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!brand) {
      throw new BadRequestException('Unknown brand');
    }

    return {
      brand: {
        key: brand.key,
        name: brand.name,
        marketAddress: brand.marketAddress,
      },
      menus: brand.menus.map((menu) => ({
        name: menu.name,
        description: menu.description,
        pointsCost: menu.pointsCost,
        color: menu.color,
      })),
    };
  }

  async createOrder(user: string, market: string, menuName: string) {
    const brand = await this.prisma.brand.findFirst({
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

    if (!brand) {
      throw new BadRequestException('Unknown market');
    }

    const selectedMenu = brand.menus[0];

    if (!selectedMenu) {
      throw new BadRequestException('Unknown menu');
    }

    const orderId = Math.floor(Date.now() / 1000);
    const rewardAmount = selectedMenu.pointsCost;

    const hash = ethers.solidityPackedKeccak256(
      ['address', 'address', 'string', 'uint256', 'uint256', 'uint256'],
      [user, market, menuName, orderId, rewardAmount, 11155111],
    );

    const signature = await this.wallet.signMessage(
      ethers.getBytes(hash),
    );

    return {
      orderId,
      rewardAmount,
      signature,
    };
  }

  async confirmOrder(
    user: string,
    market: string,
    menuName: string,
    orderId: number,
    rewardAmount: number,
    txHash: string,
  ) {
    if (!txHash) {
      throw new BadRequestException('Transaction hash is required');
    }

    const existingOrder = await this.prisma.order.findUnique({
      where: {
        orderId,
      },
    });

    if (existingOrder) {
      return {
        recorded: true,
        orderId: existingOrder.orderId,
      };
    }

    const brand = await this.prisma.brand.findFirst({
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

    if (!brand) {
      throw new BadRequestException('Unknown market');
    }

    const selectedMenu = brand.menus[0];

    if (!selectedMenu) {
      throw new BadRequestException('Unknown menu');
    }

    if (selectedMenu.pointsCost !== rewardAmount) {
      throw new BadRequestException('Invalid reward amount');
    }

    const receipt = await this.provider.getTransactionReceipt(txHash);

    if (!receipt || receipt.status !== 1) {
      throw new BadRequestException('Transaction was not confirmed');
    }

    const tx = await this.provider.getTransaction(txHash);

    if (!tx) {
      throw new BadRequestException('Transaction not found');
    }

    const kaminAddress = process.env.KAMIN_ADDRESS?.toLowerCase();

    if (!kaminAddress || tx.to?.toLowerCase() !== kaminAddress) {
      throw new BadRequestException('Unexpected transaction target');
    }

    if (tx.from.toLowerCase() !== user.toLowerCase()) {
      throw new BadRequestException('Transaction sender mismatch');
    }

    const parsed = this.kaminInterface.parseTransaction({
      data: tx.data,
      value: tx.value,
    });

    if (!parsed || parsed.name !== 'confirmOrder') {
      throw new BadRequestException('Unexpected transaction payload');
    }

    const [txMarket, txMenuName, txOrderId, txRewardAmount] = parsed.args;

    if (txMarket.toLowerCase() !== market.toLowerCase()) {
      throw new BadRequestException('Market mismatch');
    }

    if (txMenuName !== menuName) {
      throw new BadRequestException('Menu mismatch');
    }

    if (Number(txOrderId) !== orderId) {
      throw new BadRequestException('Order ID mismatch');
    }

    if (Number(txRewardAmount) !== rewardAmount) {
      throw new BadRequestException('Reward amount mismatch');
    }

    await this.prisma.order.create({
      data: {
        userAddress: user,
        marketAddress: market,
        menuName,
        orderId,
        rewardAmount,
        brandId: brand.id,
        menuId: selectedMenu.id,
      },
    });

    return {
      recorded: true,
      orderId,
    };
  }
}

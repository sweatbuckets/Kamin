import { BadRequestException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { BrandService } from '../brand/brand.service';
import { OrderVerificationService } from '../order-verification/order-verification.service';
import { UserService } from '../user/user.service';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly brandService: BrandService,
    private readonly orderVerificationService: OrderVerificationService,
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
  ) {}

  private readonly wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);

  async getHistory(user: string) {
    if (!user) {
      throw new BadRequestException('User address is required');
    }

    const orders = await this.orderRepository.findHistoryByWalletAddress(
      user.toLowerCase(),
    );

    return {
      orders: orders.map((order) => ({
        id: order.id,
        orderId: order.orderId,
        userAddress: order.user.walletAddress,
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

    const orders = await this.orderRepository.findGrassByWalletAddress(
      user.toLowerCase(),
      since,
    );

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

  async createOrder(user: string, market: string, menuName: string) {
    const brand = await this.brandService.findWithMenuByMarketAndName(
      market,
      menuName,
    );

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
    const existingOrder = await this.orderRepository.findByOrderId(orderId);

    if (existingOrder) {
      return {
        recorded: true,
        orderId: existingOrder.orderId,
      };
    }

    const brand = await this.brandService.findWithMenuByMarketAndName(
      market,
      menuName,
    );

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

    await this.orderVerificationService.verifyConfirmedOrder({
      user,
      market,
      menuName,
      orderId,
      rewardAmount,
      txHash,
    });

    const normalizedAddress = user.toLowerCase();

    const syncedUser = await this.userService.findOrCreateByWalletAddress(
      normalizedAddress,
    );

    await this.orderRepository.create({
      userId: syncedUser.id,
      marketAddress: market,
      menuName,
      orderId,
      rewardAmount,
      brandId: brand.id,
      menuId: selectedMenu.id,
    });

    return {
      recorded: true,
      orderId,
    };
  }
}

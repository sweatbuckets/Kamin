import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByWalletAddress(walletAddress: string) {
    return this.prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });
  }

  create(walletAddress: string) {
    return this.prisma.user.create({
      data: {
        walletAddress,
      },
    });
  }

  upsertByWalletAddress(walletAddress: string) {
    return this.prisma.user.upsert({
      where: {
        walletAddress,
      },
      update: {},
      create: {
        walletAddress,
      },
    });
  }
}

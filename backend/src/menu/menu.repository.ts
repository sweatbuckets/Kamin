import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveMenusByBrandId(brandId: number) {
    return this.prisma.menu.findMany({
      where: {
        brandId,
        isActive: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}

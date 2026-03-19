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

  findByBrandIdAndName(brandId: number, name: string) {
    return this.prisma.menu.findUnique({
      where: {
        brandId_name: {
          brandId,
          name,
        },
      },
    });
  }

  create(data: {
    brandId: number;
    name: string;
    description: string;
    pointsCost: number;
    color: string;
    isActive?: boolean;
  }) {
    return this.prisma.menu.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
  }
}

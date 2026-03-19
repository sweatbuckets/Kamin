import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandService } from '../brand/brand.service';
import { MenuRepository } from './menu.repository';

@Injectable()
export class MenuService {
  constructor(
    private readonly brandService: BrandService,
    private readonly menuRepository: MenuRepository,
  ) {}

  async getMenus(brandKey: string) {
    const brand = await this.brandService.findByKey(brandKey);

    if (!brand) {
      throw new BadRequestException('Unknown brand');
    }

    const menus = await this.menuRepository.findActiveMenusByBrandId(brand.id);

    return {
      brand: {
        key: brand.key,
        name: brand.name,
        marketAddress: brand.marketAddress,
      },
      menus: menus.map((menu) => ({
        name: menu.name,
        description: menu.description,
        pointsCost: menu.pointsCost,
        color: menu.color,
      })),
    };
  }

  async createMenu(input: {
    brandKey: string;
    name: string;
    description: string;
    pointsCost: number;
    color: string;
    isActive?: boolean;
  }) {
    const { brandKey, name, description, pointsCost, color, isActive } = input;

    if (!brandKey || !name || !description || !color) {
      throw new BadRequestException(
        'Brand, name, description, and color are required',
      );
    }

    if (!Number.isFinite(pointsCost) || pointsCost <= 0) {
      throw new BadRequestException('pointsCost must be a positive number');
    }

    const brand = await this.brandService.findByKey(brandKey);

    if (!brand) {
      throw new BadRequestException('Unknown brand');
    }

    const existingMenu = await this.menuRepository.findByBrandIdAndName(
      brand.id,
      name,
    );

    if (existingMenu) {
      throw new BadRequestException('Menu already exists for this brand');
    }

    const menu = await this.menuRepository.create({
      brandId: brand.id,
      name,
      description,
      pointsCost,
      color,
      isActive,
    });

    return {
      brand: {
        key: brand.key,
        name: brand.name,
      },
      menu: {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        pointsCost: menu.pointsCost,
        color: menu.color,
        isActive: menu.isActive,
      },
    };
  }
}

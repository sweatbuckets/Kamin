import { Controller, Get, Query } from '@nestjs/common';
import { GetBrandSummaryQueryDto } from './dto/get-brand-summary-query.dto';
import { BrandService } from './brand.service';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('summary')
  async getSummary(@Query() query: GetBrandSummaryQueryDto) {
    const brands = await this.brandService.findSummaryByWalletAddress(
      (query.user ?? '').toLowerCase(),
    );

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
}

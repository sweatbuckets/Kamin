import { Controller, Get, Query } from '@nestjs/common';
import { GetBrandSummaryQueryDto } from './dto/get-brand-summary-query.dto';
import {
  BrandSummaryItemDto,
  GetBrandSummaryResponseDto,
} from './dto/get-brand-summary-response.dto';
import { BrandService } from './brand.service';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('summary')
  async getSummary(
    @Query() query: GetBrandSummaryQueryDto,
  ): Promise<GetBrandSummaryResponseDto> {
    const brands = await this.brandService.findSummaryByWalletAddress(
      (query.user ?? '').toLowerCase(),
    );

    return {
      brands: brands.map(
        (brand): BrandSummaryItemDto => ({
          key: brand.key,
          name: brand.name,
          marketAddress: brand.marketAddress,
          logoPath: brand.logoPath,
          orderCount: brand._count.orders,
        }),
      ),
    };
  }
}

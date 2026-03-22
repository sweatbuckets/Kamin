export class BrandSummaryItemDto {
  key!: string;
  name!: string;
  marketAddress!: string;
  logoPath!: string | null;
  orderCount!: number;
}

export class GetBrandSummaryResponseDto {
  brands!: BrandSummaryItemDto[];
}

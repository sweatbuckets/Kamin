import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repository';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  findSummaryByWalletAddress(walletAddress: string) {
    if (!walletAddress) {
      throw new BadRequestException('User address is required');
    }

    return this.brandRepository.findSummaryByWalletAddress(walletAddress);
  }

  findByKey(brandKey: string) {
    return this.brandRepository.findWithMenusByKey(brandKey);
  }

  findWithMenuByMarketAndName(market: string, menuName: string) {
    return this.brandRepository.findWithMenuByMarketAndName(market, menuName);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(walletAddress: string) {
    if (!walletAddress) {
      throw new BadRequestException('Wallet address is required');
    }

    const normalizedAddress = walletAddress.toLowerCase();

    const existingUser = await this.userRepository.findByWalletAddress(
      normalizedAddress,
    );

    if (existingUser) {
      return {
        user: existingUser,
        created: false,
      };
    }

    const user = await this.userRepository.create(normalizedAddress);

    return {
      user,
      created: true,
    };
  }
}

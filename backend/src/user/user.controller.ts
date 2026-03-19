import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: { walletAddress?: string }) {
    return this.userService.login(body.walletAddress ?? '');
  }
}

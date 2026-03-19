import { Module } from '@nestjs/common';
import { BrandRepository } from '../brand/brand.repository';
import { MenuRepository } from '../menu/menu.repository';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    BrandRepository,
    MenuRepository,
  ],
})
export class OrderModule {}

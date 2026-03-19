import { Module } from '@nestjs/common';
import { BrandModule } from '../brand/brand.module';
import { OrderVerificationModule } from '../order-verification/order-verification.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, BrandModule, OrderVerificationModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}

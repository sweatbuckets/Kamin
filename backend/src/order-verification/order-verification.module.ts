import { Module } from '@nestjs/common';
import { OrderVerificationService } from './order-verification.service';

@Module({
  providers: [OrderVerificationService],
  exports: [OrderVerificationService],
})
export class OrderVerificationModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandModule } from './brand/brand.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { OrderVerificationModule } from './order-verification/order-verification.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    BrandModule,
    MenuModule,
    OrderModule,
    OrderVerificationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

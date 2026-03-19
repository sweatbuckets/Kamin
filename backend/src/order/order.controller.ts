import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderUserQueryDto } from './dto/get-order-user-query.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('history')
  async getHistory(@Query() query: GetOrderUserQueryDto) {
    return this.orderService.getHistory(query.user ?? '');
  }

  @Get('grass')
  async getGrass(@Query() query: GetOrderUserQueryDto) {
    return this.orderService.getGrass(query.user ?? '');
  }

  @Post()
  async create(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(
      body.user ?? '',
      body.market ?? '',
      body.menuName ?? '',
    );
  }

  @Post('confirm')
  async confirm(@Body() body: ConfirmOrderDto) {
    return this.orderService.confirmOrder(
      body.user ?? '',
      body.market ?? '',
      body.menuName ?? '',
      Number(body.orderId),
      Number(body.rewardAmount),
      body.txHash ?? '',
    );
  }
}

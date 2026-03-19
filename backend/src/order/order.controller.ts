import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('menus')
  async getMenus(@Query('brand') brand: string) {
    return this.orderService.getMenus(brand);
  }

  @Get('history')
  async getHistory(@Query('user') user: string) {
    return this.orderService.getHistory(user);
  }

  @Get('grass')
  async getGrass(@Query('user') user: string) {
    return this.orderService.getGrass(user);
  }

  @Get('summary')
  async getSummary(@Query('user') user: string) {
    return this.orderService.getSummary(user);
  }

  @Post()
  async create(@Body() body: any) {
    const { user, market, menuName } = body;

    return this.orderService.createOrder(user, market, menuName);
  }
}

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { GetMenusQueryDto } from './dto/get-menus-query.dto';
import { MenuService } from './menu.service';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus(@Query() query: GetMenusQueryDto) {
    return this.menuService.getMenus(query.brand ?? '');
  }

  @Post()
  async createMenu(@Body() body: CreateMenuDto) {
    return this.menuService.createMenu({
      brandKey: body.brandKey ?? '',
      name: body.name ?? '',
      description: body.description ?? '',
      pointsCost: Number(body.pointsCost),
      color: body.color ?? '',
      isActive: body.isActive,
    });
  }
}

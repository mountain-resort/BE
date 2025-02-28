import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DiningService } from './dining.service';
import { CreateDiningDto } from './dto/create-dining.dto';
import { UpdateDiningDto } from './dto/update-dining.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryStringDto } from './dto/query-string.dto';

@Controller('dining')
export class DiningController {
  constructor(private readonly diningService: DiningService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createDining(@Body() createDiningDto: CreateDiningDto) {
    return this.diningService.createDining(createDiningDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getDiningList(@Query() query: QueryStringDto) {
    const { keyword = '', isDeleted = null, type = null, sortBy = 'createdAt', orderBy = 'desc', page = 1, pageSize = 10 } = query;
    const diningList = this.diningService.getDiningList(page, pageSize, keyword, isDeleted, type, sortBy, orderBy);
    return diningList;
  }

  @Get(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  getDiningById(@Param('id') diningId: number) {
    const dining = this.diningService.getDiningById(diningId);
    return dining;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  updateDining(@Param('id') diningId: number, @Body() updateDiningDto: UpdateDiningDto) {
    const dining = this.diningService.updateDining(diningId, updateDiningDto);
    return dining;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  removeDining(@Param('id') diningId: number) {
    const dining = this.diningService.deleteDining(diningId);
    return dining;
  }
}

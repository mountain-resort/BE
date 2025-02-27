import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryStringDto } from './dto/query-string.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async getActivityList(@Query() params: QueryStringDto) {
    return this.activitiesService.getActivityList(params);
  }

  @Get(':id')
  getActivityById(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.getActivityById(id);
  }

  @Post()
  createActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Patch(':id')
  updateActivity(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.updateActivity(+id, updateActivityDto);
  }

  @Delete(':id')
  deleteActivityById(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.deleteActivityById(id);
  }
}

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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivitiesService } from './activities.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryStringDto } from './dto/query-string.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getActivityList(@Query() params: QueryStringDto) {
    params.sortBy = params.sortBy || 'name';
    params.orderBy = params.orderBy || 'asc';

    return await this.activitiesService.getActivityList(params);
  }

  @Get(':id')
  async getActivityById(@Param('id', ParseIntPipe) id: number) {
    return await this.activitiesService.getActivityById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(FileInterceptor('image'))
  async createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = await this.cloudinaryService.uploadImage(file, 'image');

    const activityWithImage = {
      ...createActivityDto,
      imageUrl,
    };

    return await this.activitiesService.createActivity(activityWithImage);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(FileInterceptor('image'))
  async updateActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: UpdateActivityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (
      !file &&
      (!updateActivityDto || Object.keys(updateActivityDto).length === 0)
    ) {
      throw new BadRequestException('Update request body cannot be empty');
    }

    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file, 'image');
      updateActivityDto = updateActivityDto || {};
      updateActivityDto.imageUrl = imageUrl;
    }

    return await this.activitiesService.updateActivity(id, updateActivityDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  @HttpCode(204)
  async deleteActivityById(@Param('id', ParseIntPipe) id: number) {
    return await this.activitiesService.deleteActivityById(id);
  }
}

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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivitiesService } from './activities.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryStringDto } from './dto/query-string.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getActivityList(@Query() params: QueryStringDto) {
    return await this.activitiesService.getActivityList(params);
  }

  @Get(':id')
  async getActivityById(@Param('id', ParseIntPipe) id: number) {
    return await this.activitiesService.getActivityById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // 1. 이미지를 Cloudinary에 업로드하고 URL 받기
    const imageUrl = await this.cloudinaryService.uploadImage(
      file,
      'image', // Cloudinary의 image 폴더에 저장
    );

    // 2. DTO와 이미지 URL을 합쳐서 활동 생성
    const activityWithImage = {
      ...createActivityDto,
      imageUrl,
    };

    // 3. 데이터베이스에 저장
    return await this.activitiesService.createActivity(activityWithImage);
  }

  @Patch(':id')
  async updateActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return await this.activitiesService.updateActivity(id, updateActivityDto);
  }

  @Delete(':id')
  async deleteActivityById(@Param('id', ParseIntPipe) id: number) {
    return await this.activitiesService.deleteActivityById(id);
  }
}

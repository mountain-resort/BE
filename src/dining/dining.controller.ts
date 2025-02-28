import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DiningService } from './dining.service';
import { CreateDiningDto } from './dto/create-dining.dto';
import { UpdateDiningDto } from './dto/update-dining.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryStringDto } from './dto/query-string.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
@Controller('dining')
export class DiningController {
  constructor(
    private readonly diningService: DiningService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(FileInterceptor('imageUrl'))
  @UseInterceptors(FileInterceptor('menuUrl'))
  async createDining(
    @Body() createDiningDto: CreateDiningDto,
    @UploadedFile() file: Express.Multer.File,
    @UploadedFile() menu: Express.Multer.File,
  ) {
    const [imageUrl, menuUrl] = await Promise.all([
      this.cloudinaryService.uploadImage(file, 'image'),
      this.cloudinaryService.uploadImage(menu, 'menu'),
    ]);
    const diningWithImage = {
      ...createDiningDto,
      imageUrl,
      menuUrl,
    };
    return this.diningService.createDining(diningWithImage);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getDiningList(@Query() query: QueryStringDto) {
    const {
      keyword = '',
      isDeleted = null,
      type = null,
      sortBy = 'createdAt',
      orderBy = 'desc',
      page = 1,
      pageSize = 10,
    } = query;
    const diningList = await this.diningService.getDiningList(
      page,
      pageSize,
      keyword,
      isDeleted,
      type,
      sortBy,
      orderBy,
    );
    return diningList;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  async getDiningById(@Param('id') diningId: number) {
    const dining = await this.diningService.getDiningById(diningId);
    return dining;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(FileInterceptor('imageUrl'))
  @UseInterceptors(FileInterceptor('menuUrl'))
  async updateDining(
    @Param('id') diningId: number,
    @Body() updateDiningDto: UpdateDiningDto,
    @UploadedFile() file: Express.Multer.File,
    @UploadedFile() menu: Express.Multer.File,
  ) {
    const [imageUrl, menuUrl] = await Promise.all([
      this.cloudinaryService.uploadImage(file, 'image'),
      this.cloudinaryService.uploadImage(menu, 'menu'),
    ]);
    const diningWithImage = {
      ...updateDiningDto,
      imageUrl,
      menuUrl,
    };
    const dining = await this.diningService.updateDining(
      diningId,
      diningWithImage,
    );
    return dining;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  async removeDining(@Param('id') diningId: number) {
    const dining = await this.diningService.deleteDining(diningId);
    return dining;
  }
}

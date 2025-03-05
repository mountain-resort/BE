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
  BadRequestException,
  HttpCode,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { QueryStringDto } from './dto/query-string.dto';
import { TokenPayloadDto } from 'src/common/dto/token-payload.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getCategoryList(@Query() params: QueryStringDto) {
    params.sortBy = params.sortBy || 'name';
    params.orderBy = params.orderBy || 'asc';

    return await this.categoriesService.getCategoryList(params);
  }

  @Get(':id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'heroImage', maxCount: 1 },
    ]),
  )
  async createCategory(
    @User() user: TokenPayloadDto,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFiles()
    files: { image: Express.Multer.File[]; heroImage: Express.Multer.File[] },
  ) {
    const imageUrl = await this.cloudinaryService.uploadImage(
      files.image[0],
      'image',
    );
    const heroImageUrl = await this.cloudinaryService.uploadImage(
      files.heroImage[0],
      'heroImage',
    );
    const categoryData = {
      ...createCategoryDto,
      imageUrl,
      heroImageUrl,
    };
    return await this.categoriesService.createCategory(categoryData, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'heroImage', maxCount: 1 },
    ]),
  )
  async updateCategory(
    @User() user: TokenPayloadDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFiles()
    files: { image: Express.Multer.File[]; heroImage: Express.Multer.File[] },
  ) {
    if (
      !files &&
      (!updateCategoryDto || Object.keys(updateCategoryDto).length === 0)
    ) {
      throw new BadRequestException('Update request body cannot be empty');
    }
    let categoryData = {
      ...updateCategoryDto,
    };

    if (files?.image?.[0]) {
      categoryData.imageUrl = await this.cloudinaryService.uploadImage(
        files.image[0],
        'image',
      );
    }

    if (files?.heroImage?.[0]) {
      categoryData.heroImageUrl = await this.cloudinaryService.uploadImage(
        files.heroImage[0],
        'heroImage',
      );
    }

    return await this.categoriesService.updateCategory(
      id,
      categoryData,
      user.id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  @HttpCode(204)
  async deleteCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.deleteCategoryById(id);
  }

  @Patch(':id/restore')
  @UseGuards(AuthGuard('jwt-admin'))
  async restoreCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.restoreCategoryById(id);
  }
}

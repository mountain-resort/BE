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
      adminId: user.id,
    };
    return await this.categoriesService.createCategory(categoryData);
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
    const imageUrl = await this.cloudinaryService.uploadImage(
      files.image[0],
      'image',
    );
    const heroImageUrl = await this.cloudinaryService.uploadImage(
      files.heroImage[0],
      'heroImage',
    );
    const categoryData = {
      ...updateCategoryDto,
      imageUrl,
      heroImageUrl,
      adminId: user.id,
    };
    return await this.categoriesService.updateCategory(id, categoryData);
  }

  @Delete(':id')
  async deleteCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.deleteCategoryById(id);
  }
}

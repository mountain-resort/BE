import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UploadedFile,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementListQueryDto } from './dto/query-string.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayloadDto } from 'src/common/dto/token-payload.dto';
import { ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
@Controller('announcements')
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt-admin'))
  async getAnnouncementList(@Query() query: AnnouncementListQueryDto) {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      isDeleted = null,
      sortBy = 'createdAt',
      orderBy = 'desc',
    } = query;
    return this.announcementsService.getAnnouncementList(
      page,
      pageSize,
      keyword,
      isDeleted,
      sortBy,
      orderBy,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  async getAnnouncementById(@Param('id') announcementId: number) {
    return this.announcementsService.getAnnouncementById(announcementId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(FileInterceptor('fileUrl'))
  @UseInterceptors(FileInterceptor('imageUrl'))
  async createAnnouncement(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @User() user: TokenPayloadDto,
    @UploadedFile() file: Express.Multer.File,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const [fileUrl, imageUrl] = await Promise.all([
      this.cloudinaryService.uploadFile(file, 'files'),
      this.cloudinaryService.uploadImage(image, 'images'),
    ]);
    return this.announcementsService.createAnnouncement(user.id, {
      ...createAnnouncementDto,
      fileUrl,
      imageUrl,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  @UseInterceptors(FileInterceptor('fileUrl'))
  @UseInterceptors(FileInterceptor('imageUrl'))
  async updateAnnouncement(
    @Param('id') announcementId: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @User() user: TokenPayloadDto,
    @UploadedFile() file: Express.Multer.File,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const [fileUrl, imageUrl] = await Promise.all([
      this.cloudinaryService.uploadFile(file, 'files'),
      this.cloudinaryService.uploadImage(image, 'images'),
    ]);
    return this.announcementsService.updateAnnouncement(
      user.id,
      announcementId,
      {
        ...updateAnnouncementDto,
        fileUrl,
        imageUrl,
      },
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  async deleteAnnouncement(
    @Param('id') announcementId: number,
    @User() user: TokenPayloadDto,
  ) {
    return this.announcementsService.deleteAnnouncement(user, announcementId);
  }

  @Post(':id/pin')
  @UseGuards(AuthGuard('jwt-admin'))
  async pinAnnouncement(
    @Param('id') announcementId: number,
    @User() user: TokenPayloadDto,
  ) {
    if (user.authority !== 'MANAGER') {
      throw new ForbiddenException('pin is only for manager');
    }
    return this.announcementsService.pinAnnouncement(announcementId);
  }

  @Delete(':id/pin')
  @UseGuards(AuthGuard('jwt-admin'))
  async unpinAnnouncement(
    @Param('id') announcementId: number,
    @User() user: TokenPayloadDto,
  ) {
    if (user.authority !== 'MANAGER') {
      throw new ForbiddenException('unpin is only for manager');
    }
    return this.announcementsService.unpinAnnouncement(announcementId);
  }
}

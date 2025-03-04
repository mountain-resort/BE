import { Injectable } from '@nestjs/common';
import { AnnouncementsRepository } from './announcements.repository';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Prisma } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';
import { TokenPayloadDto } from 'src/common/dto/token-payload.dto';
@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly announcementsRepository: AnnouncementsRepository,
  ) {}

  async getAnnouncementList(
    page: number,
    pageSize: number,
    keyword: string,
    isDeleted: string | null,
    sortBy: string,
    orderBy: string,
  ) {
    const whereCondition = await this.getWhereCondition(keyword, isDeleted);
    const orderByCondition = await this.getOrderByCondition(sortBy, orderBy);
    const [announcementList, totalCount] = await Promise.all([
      this.announcementsRepository.getAnnouncementList(
        whereCondition,
        orderByCondition,
        page,
        pageSize,
      ),
      this.announcementsRepository.getTotalAnnouncementCount(whereCondition),
    ]);

    const hasNext = announcementList.length === pageSize;
    const totalPage = Math.ceil(totalCount / pageSize);

    return {
      hasNext,
      totalPage,
      currentPage: page,
      list: announcementList,
    };
  }

  async getAnnouncementById(id: number) {
    const announcement =
      await this.announcementsRepository.getAnnouncementById(id);
    return announcement;
  }

  async createAnnouncement(adminId: number, data: CreateAnnouncementDto) {
    const announcement = await this.announcementsRepository.createAnnouncement(
      adminId,
      data,
    );
    return announcement;
  }

  async updateAnnouncement(
    adminId: number,
    announcementId: number,
    data: UpdateAnnouncementDto,
  ) {
    const announcement =
      await this.announcementsRepository.getAnnouncementById(announcementId);
    if (announcement.createdBy.id !== adminId) {
      throw new ForbiddenException('Only the author can edit the post.');
    }
    const updatedAnnouncement =
      await this.announcementsRepository.updateAnnouncement(
        announcementId,
        data,
      );
    return updatedAnnouncement;
  }

  async deleteAnnouncement(user: TokenPayloadDto, announcementId: number) {
    const announcement =
      await this.announcementsRepository.getAnnouncementById(announcementId);
    if (announcement.createdBy.id !== user.id || user.authority !== 'MANAGER') {
      throw new ForbiddenException(
        'Only the author can delete the post or manager can delete the post',
      );
    }
    const deletedAnnouncement =
      await this.announcementsRepository.deleteAnnouncement(announcementId);
    return deletedAnnouncement;
  }

  async pinAnnouncement(id: number) {
    const announcement = await this.announcementsRepository.pinAnnouncement(id);
    return announcement;
  }

  async unpinAnnouncement(id: number) {
    const announcement =
      await this.announcementsRepository.unpinAnnouncement(id);
    return announcement;
  }

  private async getWhereCondition(keyword: string, isDeleted: string | null) {
    const where: Prisma.AnnouncementWhereInput = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }
    if (isDeleted !== null && isDeleted !== 'null') {
      where.isDeleted = isDeleted === 'true' ? true : false;
    }
    return where;
  }

  private async getOrderByCondition(sortBy: string, orderBy: string) {
    const orderByCondition: Prisma.AnnouncementOrderByWithRelationInput = {
      [sortBy]: orderBy as Prisma.SortOrder,
    };
    return orderByCondition;
  }
}

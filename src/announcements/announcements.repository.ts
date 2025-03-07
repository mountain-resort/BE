import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma-client';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class AnnouncementsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getTotalAnnouncementCount(where: Prisma.AnnouncementWhereInput) {
    return this.prisma.announcement.count({ where });
  }

  getAnnouncementList(
    where: Prisma.AnnouncementWhereInput,
    orderBy: Prisma.AnnouncementOrderByWithRelationInput,
    page: number,
    pageSize: number,
  ) {
    return this.prisma.announcement.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        isPinned: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  getAnnouncementById(id: number) {
    return this.prisma.announcement.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        isPinned: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  createAnnouncement(adminId: number, data: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        ...data,
        adminId,
      },
    });
  }

  updateAnnouncement(id: number, data: UpdateAnnouncementDto) {
    return this.prisma.announcement.update({
      where: { id },
      data,
    });
  }

  deleteAnnouncement(id: number) {
    return this.prisma.announcement.delete({
      where: { id },
    });
  }

  pinAnnouncement(id: number) {
    return this.prisma.announcement.update({
      where: { id },
      data: { isPinned: true },
    });
  }

  unpinAnnouncement(id: number) {
    return this.prisma.announcement.update({
      where: { id },
      data: { isPinned: false },
    });
  }
}

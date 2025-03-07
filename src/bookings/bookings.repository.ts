import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma-client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class BookingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(
    memberId: number,
    rewardPoints: number,
    referenceNumber: string,
    data: CreateBookingDto,
  ) {
    return this.prisma.booking.create({
      data: {
        memberId,
        rewardPoints,
        referenceNumber,
        ...data,
      },
      select: {
        id: true,
        referenceNumber: true,
        checkInDate: true,
        checkOutDate: true,
        status: true,
        name: true,
        email: true,
        priceAtBooking: true,
        rewardPoints: true,
        roomType: {
          select: {
            id: true,
            roomClass: true,
            totalRooms: true,
            occupancy: true,
            size: true,
            bedding: true,
            amenities: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findReferenceNumbersByDate(date: Date) {
    const datePrefix = date.toISOString().slice(0, 10).replace(/-/g, '');

    return this.prisma.booking.findMany({
      where: {
        referenceNumber: {
          startsWith: datePrefix,
        },
      },
      select: {
        referenceNumber: true,
      },
    });
  }

  getTotalBookingCount(where: Prisma.BookingWhereInput) {
    return this.prisma.booking.count({ where });
  }

  getBookingList(
    page: number,
    pageSize: number,
    where: Prisma.BookingWhereInput,
  ) {
    return this.prisma.booking.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        referenceNumber: true,
        checkInDate: true,
        checkOutDate: true,
        status: true,
        name: true,
        email: true,
        priceAtBooking: true,
        rewardPoints: true,
        roomType: {
          select: {
            id: true,
            roomClass: true,
            totalRooms: true,
            occupancy: true,
            size: true,
            bedding: true,
            amenities: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  getBookingById(id: number) {
    return this.prisma.booking.findUniqueOrThrow({
      where: { id },
    });
  }

  getBookingByReferenceNumber(referenceNumber: string) {
    return this.prisma.booking.findUniqueOrThrow({
      where: { referenceNumber },
    });
  }

  updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      select: {
        id: true,
        referenceNumber: true,
        checkInDate: true,
        checkOutDate: true,
        status: true,
        name: true,
        email: true,
        priceAtBooking: true,
        rewardPoints: true,
        roomType: {
          select: {
            id: true,
            roomClass: true,
            totalRooms: true,
            occupancy: true,
            size: true,
            bedding: true,
            amenities: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  removeBooking(id: number) {
    return this.prisma.booking.delete({
      where: { id },
      select: {
        id: true,
        referenceNumber: true,
        checkInDate: true,
        checkOutDate: true,
        status: true,
        name: true,
        email: true,
        priceAtBooking: true,
        rewardPoints: true,
        roomType: {
          select: {
            id: true,
            roomClass: true,
            totalRooms: true,
            occupancy: true,
            size: true,
            bedding: true,
            amenities: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}

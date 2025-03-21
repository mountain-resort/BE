import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingsRepository } from './bookings.repository';
import { Prisma, BookingStatus } from '@prisma/client';
@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  async createBooking(memberId: number, data: CreateBookingDto) {
    const referenceNumber = await this.generateReferenceNumber();
    const rewardPoints = data.priceAtBooking * 0.05; // 5% 적립

    const booking = await this.bookingsRepository.createBooking(
      memberId,
      rewardPoints,
      referenceNumber,
      data,
    );
    return booking;
  }

  async getBookingList(
    page: number,
    pageSize: number,
    status: string,
    startDate: Date,
    endDate: Date,
    roomType: number,
  ) {
    const where = await this.getWhereCondition({
      status: status as BookingStatus,
      roomType,
      startDate,
      endDate,
    });
    const [bookingList, totalBookings] = await Promise.all([
      this.bookingsRepository.getBookingList(page, pageSize, where),
      this.bookingsRepository.getTotalBookingCount(where),
    ]);

    const hasNext = totalBookings > page * pageSize;
    const totalPages = Math.ceil(totalBookings / pageSize);

    return {
      hasNext,
      totalPages,
      currentPage: page,
      list: bookingList,
    };
  }

  async getBookingByReferenceNumber(referenceNumber: string) {
    return this.bookingsRepository.getBookingByReferenceNumber(referenceNumber);
  }

  async getBookingById(id: number) {
    return this.bookingsRepository.getBookingById(id);
  }

  async getMyBookingList(
    memberId: number,
    lastId: number,
    pageSize: number,
    isToday: string,
    sortBy: string,
    orderBy: string,
    roomType: number,
    status: BookingStatus,
  ) {
    const orderByCondition = this.getOrderByCondition(sortBy, orderBy);
    const where = await this.getWhereCondition({
      status,
      roomType,
      isToday,
    });
    return this.bookingsRepository.getMyBookingList(
      memberId,
      lastId,
      pageSize,
      where,
      orderByCondition,
    );
  }

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
    return this.bookingsRepository.updateBooking(id, updateBookingDto);
  }

  async removeBooking(id: number) {
    return this.bookingsRepository.removeBooking(id);
  }

  async checkInBooking(id: number, roomId: number) {
    return this.bookingsRepository.checkInBooking(id, roomId);
  }

  async checkOutBooking(id: number) {
    return this.bookingsRepository.checkOutBooking(id);
  }

  // 예약 번호 생성
  private async generateReferenceNumber() {
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // 해당 날짜의 기존 예약 번호들을 조회
    const existingBookings =
      await this.bookingsRepository.findReferenceNumbersByDate(new Date());
    const existingNumbers = new Set(
      existingBookings.map((booking) => booking.referenceNumber),
    );

    // 중복되지 않는 번호를 찾을 때까지 반복
    let referenceNumber: string;
    do {
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      referenceNumber = `${datePrefix}${random}`;
    } while (existingNumbers.has(referenceNumber));

    return referenceNumber;
  }

  private async getWhereCondition({
    status,
    roomType,
    startDate,
    endDate,
    isToday,
  }: {
    status: BookingStatus;
    roomType: number;
    startDate?: Date;
    endDate?: Date;
    isToday?: string;
  }) {
    const where: Prisma.BookingWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (startDate && endDate) {
      where.checkInDate = {
        gte: startDate,
        lte: endDate,
      };
    }
    if (isToday) {
      where.checkInDate = {
        equals: new Date(),
      };
    }
    if (roomType) {
      where.roomType = {
        id: roomType,
      };
    }
    return where;
  }

  private getOrderByCondition(sortBy: string, orderBy: string) {
    const orderByCondition: Prisma.BookingOrderByWithRelationInput = {
      [sortBy]: orderBy,
    };
    return orderByCondition;
  }
}

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
    propertyId: number,
  ) {
    const where = await this.getWhereCondition(
      status as BookingStatus,
      startDate,
      endDate,
      propertyId,
    );
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

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
    return this.bookingsRepository.updateBooking(id, updateBookingDto);
  }

  async removeBooking(id: number) {
    return this.bookingsRepository.removeBooking(id);
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

  private async getWhereCondition(
    status: BookingStatus,
    startDate: Date,
    endDate: Date,
    propertyId: number,
  ) {
    const where: Prisma.BookingWhereInput = {
      status,
      checkInDate: {
        gte: startDate,
        lte: endDate,
      },
      roomType: {
        propertyId,
      },
    };
    return where;
  }
}

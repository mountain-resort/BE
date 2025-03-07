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
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayloadDto } from 'src/common/dto/token-payload.dto';
import { QueryStringDto } from './dto/query-string.dto';
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @User() user: TokenPayloadDto,
  ) {
    const memberId = user.id;
    return this.bookingsService.createBooking(memberId, createBookingDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt-admin'))
  getBookingList(@Query() query: QueryStringDto) {
    const { page, pageSize, status, startDate, endDate, propertyId } = query;
    return this.bookingsService.getBookingList(
      page,
      pageSize,
      status,
      startDate,
      endDate,
      propertyId,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  getBookingById(@Param('id') bookingId: number) {
    return this.bookingsService.getBookingById(bookingId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  updateBooking(
    @Param('id') bookingId: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.updateBooking(bookingId, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-admin'))
  removeBooking(@Param('id') bookingId: number) {
    return this.bookingsService.removeBooking(bookingId);
  }
}

import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingsService, BookingsResolver],
})
export class BookingsModule {}

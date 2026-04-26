import { Module } from '@nestjs/common';
import { BookingsService } from './provider/bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { CabinsModule } from 'src/cabins/cabins.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), CabinsModule],
  providers: [BookingsService, BookingsResolver],
})
export class BookingsModule {}

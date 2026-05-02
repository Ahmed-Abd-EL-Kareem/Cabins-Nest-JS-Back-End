import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../bookings.entity';
import { Repository } from 'typeorm';
import { BookingDto } from '../dtos/bookings.dto';
import { CabinsService } from 'src/cabins/provider/cabins.service';
import { BookingUpdateDto } from '../dtos/updateBooking.dto';
import {
  BookingFilterArgs,
  BookingSearchArgs,
  BookingSortArgs,
  PaginatedBookings,
} from '../dtos/booking-query.args';
import { PaginationArgs } from 'src/common/dtos/pagination.args';

@Injectable()
export class BookingsService {
  constructor(
    /**
     * Inject BookingRepository
     */
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    /**
     * Inject CabinsService
     */
    private readonly cabinsService: CabinsService,
  ) {}
  async getAllBookings(
    filter?: BookingFilterArgs,
    search?: BookingSearchArgs,
    sort?: BookingSortArgs,
    pagination?: PaginationArgs,
  ): Promise<PaginatedBookings> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;
    const bookings = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.cabin', 'cabin')
      .leftJoinAndSelect('booking.guest', 'guest');

    if (filter?.status) {
      bookings.andWhere('booking.status = :status', { status: filter.status });
    }
    if (filter?.isPaid) {
      bookings.andWhere('booking.isPaid = :isPaid', { isPaid: filter.isPaid });
    }
    if (filter?.hasBreakfast !== undefined) {
      bookings.andWhere('booking.hasBreakfast = :hasBreakfast', {
        hasBreakfast: filter.hasBreakfast,
      });
    }
    if (filter?.cabinId) {
      bookings.andWhere('cabin.id = :cabinId', { cabinId: filter.cabinId });
    }
    if (filter?.guestId) {
      bookings.andWhere('guest.id = :guestId', { guestId: filter.guestId });
    }
    if (filter?.startDateFrom) {
      bookings.andWhere('booking.startDate >= :startDateFrom', {
        startDateFrom: new Date(filter.startDateFrom),
      });
    }
    if (filter?.startDateTo) {
      bookings.andWhere('booking.startDate <= :startDateTo', {
        startDateTo: new Date(filter.startDateTo),
      });
    }

    if (search?.guestName) {
      bookings.andWhere('LOWER(guest.fullName) LIKE LOWER(:guestName)', {
        guestName: `%${search.guestName}%`,
      });
    }
    if (search?.guestEmail) {
      bookings.andWhere('LOWER(guest.email) LIKE LOWER(:guestEmail)', {
        guestEmail: `%${search.guestEmail}%`,
      });
    }
    if (search?.cabinName) {
      bookings.andWhere('LOWER(cabin.name) LIKE LOWER(:cabinName)', {
        cabinName: `%${search.cabinName}%`,
      });
    }

    const sortField = sort?.field ?? 'createdAt';
    const sortOrder = sort?.order ?? 'DESC';
    bookings.orderBy(`booking.${sortField}`, sortOrder);

    bookings.skip(skip).take(limit);
    const [data, total] = await bookings.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async getBookingById(id: number): Promise<Booking | null> {
    return await this.bookingRepository.findOneBy({ id });
  }
  async getUserBookings(
    userId: number,
    filter?: BookingFilterArgs,
    sort?: BookingSortArgs,
    pagination?: PaginationArgs,
  ): Promise<PaginatedBookings> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const bookings = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.cabin', 'cabin')
      .leftJoinAndSelect('booking.guest', 'guest')
      .where('guest.id = :userId', { userId });

    if (filter?.status) {
      bookings.andWhere('booking.status = :status', { status: filter.status });
    }
    if (filter?.isPaid !== undefined) {
      bookings.andWhere('booking.isPaid = :isPaid', { isPaid: filter.isPaid });
    }
    if (filter?.hasBreakfast !== undefined) {
      bookings.andWhere('booking.hasBreakfast = :hasBreakfast', {
        hasBreakfast: filter.hasBreakfast,
      });
    }

    const sortField = sort?.field ?? 'startDate';
    const sortOrder = sort?.order ?? 'DESC';
    bookings.orderBy(`booking.${sortField}`, sortOrder);

    bookings.skip(skip).take(limit);

    const [data, total] = await bookings.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createBooking(bookingDto: BookingDto): Promise<Booking> {
    const cabin = await this.cabinsService.getCabinById(bookingDto.cabinId);
    if (!cabin) throw new NotFoundException('Cabin not found');
    if (cabin.maxCapacity < bookingDto.numGuests)
      throw new BadRequestException('Number of guests exceeds cabin capacity');

    const cabinPrice = cabin.regularPrice;
    const extrasPrice = bookingDto.extrasPrice ?? 0;
    const totalPrice = cabinPrice + extrasPrice;

    // guestId comes directly from the frontend DTO
    const { guestId, cabinId, ...rest } = bookingDto;

    return await this.bookingRepository.save({
      ...rest,
      startDate: new Date(bookingDto.startDate),
      endDate: new Date(bookingDto.endDate),
      cabinPrice,
      extrasPrice,
      totalPrice,
      cabin: { id: cabinId },
      guest: { id: guestId },
    });
  }

  async updateBooking(
    id: number,
    updateBookingDto: BookingUpdateDto,
  ): Promise<Booking> {
    // ─── 1. find existing booking ────────────────────────────────────────────
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) throw new NotFoundException(`Booking #${id} not found`);

    const cabinChanged =
      updateBookingDto.cabinId !== undefined &&
      updateBookingDto.cabinId !== booking.cabin.id;

    const guestsChanged =
      updateBookingDto.numGuests !== undefined &&
      updateBookingDto.numGuests !== booking.numGuests;

    const extrasChanged =
      updateBookingDto.extrasPrice !== undefined &&
      updateBookingDto.extrasPrice !== booking.extrasPrice;

    // ─── 2. base update — always applied ─────────────────────────────────────
    const baseUpdate = {
      ...updateBookingDto,
      ...(updateBookingDto.startDate && {
        startDate: new Date(updateBookingDto.startDate),
      }),
      ...(updateBookingDto.endDate && {
        endDate: new Date(updateBookingDto.endDate),
      }),
    };

    // ─── 3. if nothing price-related changed — just update and return ─────────
    if (!cabinChanged && !guestsChanged && !extrasChanged) {
      await this.bookingRepository.update(id, baseUpdate);
      return (await this.bookingRepository.findOneBy({ id })) as Booking;
    }

    // ─── 4. something changed — fetch cabin and recalculate ──────────────────
    let cabin = booking.cabin;
    let cabinPrice = booking.cabinPrice;
    let extrasPrice = booking.extrasPrice ?? 0;

    if (cabinChanged) {
      const newCabin = await this.cabinsService.getCabinById(
        updateBookingDto.cabinId!,
      );
      if (!newCabin) throw new NotFoundException('Cabin not found');
      cabin = newCabin;
      cabinPrice = newCabin.regularPrice;
    }

    if (extrasChanged) {
      extrasPrice = updateBookingDto.extrasPrice!;
    }

    // ─── 5. validate capacity with final values ───────────────────────────────
    const numGuests = updateBookingDto.numGuests ?? booking.numGuests;
    if (cabin.maxCapacity < numGuests)
      throw new BadRequestException('Number of guests exceeds cabin capacity');

    // ─── 6. apply full update with recalculated prices ───────────────────────
    await this.bookingRepository.update(id, {
      ...baseUpdate,
      cabin,
      cabinPrice,
      extrasPrice,
      totalPrice: cabinPrice + extrasPrice,
    });

    // ─── 7. return fresh entity ───────────────────────────────────────────────
    return (await this.bookingRepository.findOneBy({ id })) as Booking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with id not found`);
    }
    return true;
  }
}

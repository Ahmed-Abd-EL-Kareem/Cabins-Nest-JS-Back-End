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
  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find();
  }
  async getBookingById(id: number): Promise<Booking | null> {
    return await this.bookingRepository.findOneBy({ id });
  }
  async getUserBookings(userId: number): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { guest: { id: userId } },
    });
  }
  async createBooking(
    bookingDto: BookingDto,
    guestId: number,
  ): Promise<Booking> {
    const cabin = await this.cabinsService.getCabinById(bookingDto.cabinId);
    if (!cabin) throw new NotFoundException('Cabin not found');
    if (cabin.maxCapacity < bookingDto.numGuests)
      throw new BadRequestException('Number of guests exceeds cabin capacity');
    const cabinPrice = cabin.regularPrice;
    const extrasPrice = bookingDto.extrasPrice ?? 0;
    const totalPrice = cabinPrice + extrasPrice;
    return await this.bookingRepository.save({
      ...bookingDto,
      startDate: new Date(bookingDto.startDate),
      endDate: new Date(bookingDto.endDate),
      cabinPrice,
      extrasPrice,
      totalPrice,
      cabin,
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

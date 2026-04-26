import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Booking } from './bookings.entity';
import { BookingsService } from './provider/bookings.service';
import { BookingDto } from './dtos/bookings.dto';
import { BookingUpdateDto } from './dtos/updateBooking.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { type AuthenticatedUser } from 'src/auth/interfaces/jwt.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Resolver()
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  // ─── Queries ─────────────────────────────────────────────────────────────────

  // 🔒 admin only — see all bookings
  @Query(() => [Booking])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingsService.getAllBookings();
  }

  // 🔒 admin only — get any booking by id
  @Query(() => Booking, { nullable: true })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getBookingById(@Args('id') id: number): Promise<Booking | null> {
    return this.bookingsService.getBookingById(id);
  }

  // 🔒 any logged-in user — get their own bookings
  @Query(() => [Booking])
  async getMyBookings(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Booking[]> {
    return this.bookingsService.getUserBookings(user.userId);
  }

  // ─── Mutations ───────────────────────────────────────────────────────────────

  // 🔒 any logged-in user — create a booking for themselves
  @Mutation(() => Booking)
  async createBooking(
    @Args('bookingInput') bookingDto: BookingDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Booking> {
    return this.bookingsService.createBooking(bookingDto, user.userId);
  }

  // 🔒 admin only — update any booking
  @Mutation(() => Booking)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateBooking(
    @Args('id') id: number,
    @Args('bookingUpdate') bookingUpdateDto: BookingUpdateDto,
  ): Promise<Booking> {
    return this.bookingsService.updateBooking(id, bookingUpdateDto);
  }

  // 🔒 admin only — delete any booking
  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteBooking(@Args('id') id: number): Promise<boolean> {
    return this.bookingsService.deleteBooking(id);
  }
}

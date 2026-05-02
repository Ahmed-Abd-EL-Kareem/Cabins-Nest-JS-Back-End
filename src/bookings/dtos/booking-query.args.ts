import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BookingStatus } from '../enums/status.enum';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/common/enums/sort-order.enum';
import { Booking } from '../bookings.entity';

@InputType()
export class BookingFilterArgs {
  @Field(() => BookingStatus, { nullable: true })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  startDateFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  startDateTo?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  cabinId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  guestId?: number;

  @Field({ nullable: true })
  @IsOptional()
  isPaid?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  hasBreakfast?: boolean;
}
///////////////////////////////////////////////////////////////////////////
export enum BookingSortField {
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  TOTAL_PRICE = 'totalPrice',
  CREATED_AT = 'createdAt',
  NUM_GUESTS = 'numGuests',
  NUM_NIGHTS = 'numNights',
}

registerEnumType(BookingSortField, {
  name: 'BookingSortField',
  description: 'Booking sort field',
});

@InputType()
export class BookingSortArgs {
  @Field(() => BookingSortField, {
    nullable: true,
    defaultValue: BookingSortField.CREATED_AT,
  })
  @IsOptional()
  field?: BookingSortField = BookingSortField.CREATED_AT;

  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.DESC })
  @IsOptional()
  order?: SortOrder = SortOrder.DESC;
}

//////////////////////////////////////////////////////////

@InputType()
export class BookingSearchArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  guestName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  guestEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cabinName?: string;
}

//////////////////////////////////////////////////////////

@ObjectType()
export class PaginatedBookings {
  @Field(() => [Booking])
  data!: Booking[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

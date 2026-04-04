import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BookingStatus } from '../enums/status.enum';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BookingDto {
  @Field()
  @IsNotEmpty()
  @IsISO8601()
  startDate: string;

  @Field()
  @IsNotEmpty()
  @IsISO8601()
  endDate: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @Min(2)
  numNights: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @Max(10)
  numGuests: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  cabinPrice: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  extrasPrice: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  totalPrice: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  hasBreakfast: boolean;

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isPaid: boolean;

  @Field()
  @IsOptional()
  @IsString()
  observations?: string;

  // Relations

  @Field()
  @IsUUID()
  cabinId: string;

  @Field()
  @IsUUID()
  guestId: string;
}

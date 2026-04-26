import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BookingStatus } from '../enums/status.enum';

@InputType()
export class BookingUpdateDto {
  // ─── Dates ───────────────────────────────────────────────────────────────────

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  numNights?: number;

  // ─── Guests ──────────────────────────────────────────────────────────────────

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  numGuests?: number;

  // ─── Pricing ─────────────────────────────────────────────────────────────────

  // @Field(() => Int, { nullable: true })
  // @IsOptional()
  // @IsInt()
  // cabinPrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  extrasPrice?: number;

  // @Field(() => Int, { nullable: true })
  // @IsOptional()
  // @IsInt()
  // totalPrice?: number;

  // ─── Status ──────────────────────────────────────────────────────────────────

  @Field(() => BookingStatus, { nullable: true })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  // ─── Options ─────────────────────────────────────────────────────────────────

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasBreakfast?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observations?: string;

  // ─── Relations ───────────────────────────────────────────────────────────────

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  cabinId?: number;
}

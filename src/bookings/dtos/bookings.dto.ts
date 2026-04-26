import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BookingStatus } from '../enums/status.enum';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class BookingDto {
  @Field()
  @IsNotEmpty()
  @IsISO8601()
  startDate!: string;

  @Field()
  @IsNotEmpty()
  @IsISO8601()
  endDate!: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numNights!: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numGuests!: number;

  // @Field(() => Int)
  // @IsNotEmpty()
  // @IsInt()
  // cabinPrice!: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  extrasPrice?: number;

  // @Field(() => Int)
  // @IsNotEmpty()
  // @IsInt()
  // totalPrice!: number;

  @Field(() => BookingStatus, {
    nullable: true,
    defaultValue: BookingStatus.UNCONFIRMED,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  hasBreakfast?: boolean;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isPaid!: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observations?: string;

  // Relations

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  cabinId!: number;

  @IsOptional()
  @IsInt()
  guestId?: number;
}

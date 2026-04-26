// settings.dto.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

@InputType()
export class SettingsDto {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(90)
  maxBookingLength!: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(30)
  minBookingLength!: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  maxGuestsPerBooking!: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  breakfastPrice!: number;
}

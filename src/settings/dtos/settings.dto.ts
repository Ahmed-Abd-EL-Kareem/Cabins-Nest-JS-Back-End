import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

@InputType()
export class SettingsDto {
  @Field()
  @IsNotEmpty()
  @IsInt()
  @Max(15)
  maxBookingLength: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  minBookingLength: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  maxGuestsPerBooking: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  breakfastPrice: number;
}

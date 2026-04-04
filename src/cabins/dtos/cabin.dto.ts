import { Field, InputType } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CabinDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  maxCapacity: number;

  @Field()
  @IsInt()
  @IsNotEmpty()
  regularPrice: number;

  @Field()
  @IsInt()
  @IsNotEmpty()
  discount: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1024)
  description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(2048)
  image: string;
}

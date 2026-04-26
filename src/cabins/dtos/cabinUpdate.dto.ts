import { Field, InputType } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CabinUpdateDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  name?: string;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  maxCapacity?: number;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  regularPrice?: number;

  @Field({ nullable: true, defaultValue: 0 })
  @IsInt()
  @IsOptional()
  discount?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(1024)
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(2048)
  image?: string;
}

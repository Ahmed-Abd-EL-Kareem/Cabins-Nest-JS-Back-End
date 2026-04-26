import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GoogleTokenDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  token!: string;
}

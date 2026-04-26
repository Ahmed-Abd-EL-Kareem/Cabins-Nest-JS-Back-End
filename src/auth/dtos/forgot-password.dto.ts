import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

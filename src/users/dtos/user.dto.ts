import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(36)
  fullName!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsOptional()
  nationalID?: string;

  @Field()
  @IsString()
  @IsOptional()
  nationality?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(1000)
  @IsStrongPassword()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message: 'Password too weak',
  })
  password!: string;

  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(2048)
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsEnum(UserRole)
  role?: UserRole;
}

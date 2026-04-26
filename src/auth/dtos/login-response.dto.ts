import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/users.entity';

@ObjectType()
export class LoginResponseDto {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field(() => User)
  user!: User;
}

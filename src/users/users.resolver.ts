import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './provider/users.service';
import { User } from './users.entity';

@Resolver()
export class UsersResolver {
  constructor(
    /**
     * Inject UsersService
     */
    private readonly usersService: UsersService,
  ) {}
  @Mutation(() => User)
  async createUser(@Args('userInput') userDto: UserDto): Promise<User> {
    return await this.usersService.createUser(userDto);
  }
  @Query(() => User)
  async findOneByEmail(@Args('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }
  @Query(() => [User])
  async getAllCustomers(): Promise<User[]> {
    return await this.usersService.findAllCustomers();
  }
}

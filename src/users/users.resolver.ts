import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './provider/users.service';
import { User } from './users.entity';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/common/public';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type AuthenticatedUser } from 'src/auth/interfaces/jwt.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
// import { Public } from 'src/common/public';

@Resolver()
export class UsersResolver {
  constructor(
    /**
     * Inject UsersService
     */
    private readonly usersService: UsersService,
  ) {}
  @Public()
  @Mutation(() => User)
  async createUser(@Args('userInput') userDto: UserDto): Promise<User> {
    return await this.usersService.createUser(userDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => User)
  async createAdminUser(@Args('userInput') userDto: UserDto): Promise<User> {
    return await this.usersService.createAdminUser(userDto);
  }
  @Mutation(() => User)
  async updateMyProfile(
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<User> {
    return await this.usersService.updateUser(
      currentUser.userId,
      updateUserDto,
    );
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => User, { nullable: true })
  async findOneByEmail(@Args('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [User])
  // @Public()
  async getAllCustomers(): Promise<User[]> {
    return await this.usersService.findAllCustomers();
  }
}

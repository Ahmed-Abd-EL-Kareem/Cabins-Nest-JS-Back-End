import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserDto } from '../dtos/user.dto';
import { HashingProvider } from 'src/auth/provider/hashing.provider';
import { GoogleUserPayload } from 'src/auth/interfaces/google-user-payload.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject UserRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject HashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  async createUser(@Param() userDto: UserDto) {
    try {
      const user = this.userRepository.create({
        ...userDto,
        password: await this.hashingProvider.hashPassword(userDto.password),
        role: UserRole.CUSTOMER,
      });
      if (!user) {
        throw new BadRequestException('error in Creating User');
      }
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createAdminUser(@Param() userDto: UserDto) {
    try {
      const user = this.userRepository.create({
        ...userDto,
        password: await this.hashingProvider.hashPassword(userDto.password),
        role: UserRole.ADMIN,
      });
      if (!user) {
        throw new BadRequestException('error in Creating User');
      }
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOrCreateGoogleUser(payload: GoogleUserPayload): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { googleId: payload.googleId },
    });
    if (user) return user;
    user = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (user) {
      user.googleId = payload.googleId;
      if (!user.avatar && payload.avatar) user.avatar = payload.avatar;
      return this.userRepository.save(user);
    }

    const newUser = this.userRepository.create({
      googleId: payload.googleId,
      email: payload.email,
      fullName: payload.fullName,
      avatar: payload.avatar,
    });

    return this.userRepository.save(newUser);
  }

  async findAllCustomers() {
    try {
      const customers = await this.userRepository.find({
        where: {
          role: UserRole.CUSTOMER,
        },
      });
      if (!customers) {
        throw new BadRequestException('There are no Customers!!');
      }
      return customers;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Check if new email is already taken by another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (existing) {
        throw new BadRequestException('Email is already in use');
      }
    }

    await this.userRepository.update(userId, updateUserDto);

    const updated = await this.userRepository.findOneBy({ id: userId });
    return updated as User;
  }
  async findOneByEmail(@Param() email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
  async findOneById(@Param() userId: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async setResetPasswordToken(
    userId: number,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  }
  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }
  async updatePasswordAndClearToken(
    userId: number,
    hashedPassword: string,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }
}

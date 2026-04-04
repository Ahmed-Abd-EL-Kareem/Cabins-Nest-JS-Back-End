import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Param,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserDto } from '../dtos/user.dto';
import { HashingProvider } from 'src/auth/provider/hashing.provider';

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
      });
      if (!user) {
        throw new BadRequestException('error in Creating User');
      }
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
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

  async findOneByEmail(@Param() email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CabinsService } from './provider/cabins.service';
import { CabinDto } from './dtos/cabin.dto';
import { Cabin } from './cabins.entity';
import { CabinUpdateDto } from './dtos/cabinUpdate.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Public } from 'src/common/public';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class CabinsResolver {
  constructor(
    /**
     * Inject CabinsService
     */
    private readonly cabinsService: CabinsService,
  ) {}

  @Mutation(() => Cabin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCabin(@Args('cabinInput') cabinInput: CabinDto): Promise<Cabin> {
    return await this.cabinsService.createCabin(cabinInput);
  }

  @Mutation(() => Cabin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateCabin(
    @Args('id') id: number,
    @Args('cabinUpdate') cabinUpdate: CabinUpdateDto,
  ): Promise<Cabin> {
    return await this.cabinsService.updateCabin(id, cabinUpdate);
  }
  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCabin(@Args('id') id: number): Promise<boolean> {
    return await this.cabinsService.deleteCabin(id);
  }

  @Public()
  @Query(() => [Cabin])
  async getAllCabins(): Promise<Cabin[]> {
    return await this.cabinsService.getAllCabins();
  }

  @Public()
  @Query(() => Cabin)
  async getCabinById(@Args('id') id: number): Promise<Cabin | null> {
    return await this.cabinsService.getCabinById(id);
  }
}

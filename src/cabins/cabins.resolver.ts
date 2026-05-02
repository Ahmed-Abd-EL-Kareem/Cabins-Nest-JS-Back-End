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
import {
  CabinFilterArgs,
  CabinSearchArgs,
  CabinSortArgs,
  PaginatedCabin,
} from './dtos/cabin-query.args';
import { PaginationArgs } from 'src/common/dtos/pagination.args';

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
  @Query(() => PaginatedCabin)
  async getAllCabins(
    @Args('filter', { nullable: true }) filter?: CabinFilterArgs,
    @Args('search', { nullable: true }) search?: CabinSearchArgs,
    @Args('sort', { nullable: true }) sort?: CabinSortArgs,
    @Args('pagination', { nullable: true }) pagination?: PaginationArgs,
  ): Promise<PaginatedCabin> {
    return await this.cabinsService.getAllCabins(
      filter,
      search,
      sort,
      pagination,
    );
  }

  @Public()
  @Query(() => Cabin)
  async getCabinById(@Args('id') id: number): Promise<Cabin | null> {
    return await this.cabinsService.getCabinById(id);
  }
}

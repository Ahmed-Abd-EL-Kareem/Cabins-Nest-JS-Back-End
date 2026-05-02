import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cabin } from '../cabins.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CabinDto } from '../dtos/cabin.dto';
import { CabinUpdateDto } from '../dtos/cabinUpdate.dto';
import {
  CabinFilterArgs,
  CabinSearchArgs,
  CabinSortArgs,
  PaginatedCabin,
} from '../dtos/cabin-query.args';
import { PaginationArgs } from 'src/common/dtos/pagination.args';

@Injectable()
export class CabinsService {
  constructor(
    /**
     * Inject CabinsRepository
     */
    @InjectRepository(Cabin)
    private readonly cabinsRepository: Repository<Cabin>,
  ) {}

  async createCabin(cabinDto: CabinDto): Promise<Cabin> {
    return await this.cabinsRepository.save(cabinDto);
  }
  async getAllCabins(
    filter?: CabinFilterArgs,
    search?: CabinSearchArgs,
    sort?: CabinSortArgs,
    pagination?: PaginationArgs,
  ): Promise<PaginatedCabin> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const cabins = this.cabinsRepository.createQueryBuilder('cabin');

    // ─── Filter ────────────────────────────────────────────────────────────────
    if (filter?.minCapacity) {
      cabins.andWhere('cabin.maxCapacity >= :minCapacity', {
        minCapacity: filter.minCapacity,
      });
    }
    if (filter?.maxCapacity) {
      cabins.andWhere('cabin.maxCapacity <= :maxCapacity', {
        maxCapacity: filter.maxCapacity,
      });
    }
    if (filter?.minPrice) {
      cabins.andWhere('cabin.regularPrice >= :minPrice', {
        minPrice: filter.minPrice,
      });
    }
    if (filter?.maxPrice) {
      cabins.andWhere('cabin.regularPrice <= :maxPrice', {
        maxPrice: filter.maxPrice,
      });
    }
    if (filter?.hasDiscount === true) {
      cabins.andWhere('cabin.discount > 0');
    }
    if (filter?.hasDiscount === false) {
      cabins.andWhere('cabin.discount = 0');
    }

    // ─── Search ────────────────────────────────────────────────────────────────
    if (search?.name) {
      cabins.andWhere('LOWER(cabin.name) LIKE LOWER(:name)', {
        name: `%${search.name}%`,
      });
    }
    if (search?.description) {
      cabins.andWhere('LOWER(cabin.description) LIKE LOWER(:description)', {
        description: `%${search.description}%`,
      });
    }

    // ─── Sort ──────────────────────────────────────────────────────────────────
    const sortField = sort?.field ?? 'createdAt';
    const sortOrder = sort?.order ?? 'ASC';
    cabins.orderBy(`cabin.${sortField}`, sortOrder);

    // ─── Pagination ────────────────────────────────────────────────────────────
    cabins.skip(skip).take(limit);

    const [data, total] = await cabins.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async getCabinById(id: number): Promise<Cabin | null> {
    return await this.cabinsRepository.findOneBy({ id });
  }
  async updateCabin(id: number, cabinDto: CabinUpdateDto): Promise<Cabin> {
    await this.cabinsRepository.update(id, cabinDto);
    const updated = await this.cabinsRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException(`Cabin with id ${id} not found`);
    return updated;
  }
  async deleteCabin(id: number): Promise<boolean> {
    const result = await this.cabinsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cabin with id ${id} not found`);
    }
    return true;
  }
}

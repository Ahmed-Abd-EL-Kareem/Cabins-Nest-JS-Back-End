import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cabin } from '../cabins.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CabinDto } from '../dtos/cabin.dto';
import { CabinUpdateDto } from '../dtos/cabinUpdate.dto';

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
  async getAllCabins(): Promise<Cabin[]> {
    return await this.cabinsRepository.find();
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

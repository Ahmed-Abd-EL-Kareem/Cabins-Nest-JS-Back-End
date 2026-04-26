import { Module } from '@nestjs/common';
import { CabinsService } from './provider/cabins.service';
import { CabinsResolver } from './cabins.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cabin } from './cabins.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cabin])],
  providers: [CabinsService, CabinsResolver],
  exports: [CabinsService],
})
export class CabinsModule {}

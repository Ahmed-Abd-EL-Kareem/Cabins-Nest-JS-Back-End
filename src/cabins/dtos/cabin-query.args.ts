import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/common/enums/sort-order.enum';
import { Cabin } from '../cabins.entity';

@InputType()
export class CabinFilterArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  minCapacity?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  maxCapacity?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  maxPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  hasDiscount?: boolean;
}

///////////////////////////////////////////////////////////////

export enum CabinSortField {
  NAME = 'name',
  PRICE = 'regularPrice',
  CAPACITY = 'maxCapacity',
  CREATED_AT = 'createdAt',
}

registerEnumType(CabinSortField, {
  name: 'CabinSortField',
  description: 'Cabin sort field',
});

@InputType()
export class CabinSortArgs {
  @Field(() => CabinSortField, {
    nullable: true,
    defaultValue: CabinSortField.CREATED_AT,
  })
  field?: CabinSortField = CabinSortField.CREATED_AT;
  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.ASC })
  order?: SortOrder = SortOrder.ASC;
}

///////////////////////////////////////////////////////////////////

@InputType()
export class CabinSearchArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}

////////////////////////////////////////////////////////////////////

@ObjectType()
export class PaginatedCabin {
  @Field(() => [Cabin])
  data!: Cabin[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

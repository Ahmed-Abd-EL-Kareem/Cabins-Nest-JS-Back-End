import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Booking } from 'src/bookings/bookings.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Cabin {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => Int)
  @Column()
  maxCapacity!: number;

  @Field(() => Int)
  @Column()
  regularPrice!: number;

  @Field(() => Int)
  @Column({
    default: 0,
  })
  discount!: number;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  image!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.cabin)
  bookings?: Booking[];
}

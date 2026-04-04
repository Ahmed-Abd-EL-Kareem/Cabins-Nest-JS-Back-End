import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Booking } from 'src/bookings/bookings.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Cabin {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  maxCapacity: number;

  @Field(() => Int)
  @Column()
  regularPrice: number;

  @Field(() => Int)
  @Column({
    default: 0,
  })
  discount: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  image: string;

  @OneToMany(() => Booking, (booking) => booking.cabin)
  bookings: Booking[];
}

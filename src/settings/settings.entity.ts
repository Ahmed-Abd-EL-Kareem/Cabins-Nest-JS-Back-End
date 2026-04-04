import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Settings {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ default: 0 })
  maxBookingLength: number;

  @Field(() => Int)
  @Column({ default: 0 })
  minBookingLength: number;

  @Field(() => Int)
  @Column({ default: 0 })
  maxGuestsPerBooking: number;

  @Field(() => Int)
  @Column({ default: 0 })
  breakfastPrice: number;
}

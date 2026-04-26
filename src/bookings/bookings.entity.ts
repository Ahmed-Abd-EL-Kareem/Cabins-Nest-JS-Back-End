import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Cabin } from 'src/cabins/cabins.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from './enums/status.enum';

@ObjectType()
@Entity()
export class Booking {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Index()
  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Field()
  @Index()
  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Field(() => Int)
  @Column()
  numNights!: number;

  @Field(() => Int)
  @Column()
  numGuests!: number;

  @Field(() => Int)
  @Column()
  cabinPrice!: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: 0 })
  extrasPrice?: number;

  @Field(() => Int)
  @Column()
  totalPrice!: number;

  @Field(() => BookingStatus)
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.UNCONFIRMED,
  })
  status!: BookingStatus;

  @Field()
  @Column({ default: false })
  hasBreakfast!: boolean;

  @Field()
  @Column({ default: false })
  isPaid!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  observations?: string;
  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
  // Relations

  @Field(() => Cabin)
  @Index()
  @ManyToOne(() => Cabin, (cabin) => cabin.bookings, { eager: true })
  cabin!: Cabin;

  @Field(() => User)
  @Index()
  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  guest!: User;
}

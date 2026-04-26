import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { Booking } from 'src/bookings/bookings.entity';

// registerEnumType(UserRole, {
//   name: 'UserRole',
// });
@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  fullName!: string;

  @Field()
  @Column({
    unique: true,
  })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nationalID?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nationality?: string;

  @Field({ nullable: true, defaultValue: 'https://pin.it/4YmME9yCV' })
  @Column({ nullable: true, default: 'https://pin.it/4YmME9yCV' })
  avatar?: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Field(() => UserRole, { nullable: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role?: UserRole;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.guest)
  bookings?: Booking[];

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;
}

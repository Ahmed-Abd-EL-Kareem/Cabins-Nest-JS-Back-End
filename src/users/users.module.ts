import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './provider/users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthModule } from 'src/auth/auth.module';
// import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt-auth.guard';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [
    UsersService,
    UsersResolver,
    // !Enable authentication globally
    // {
    //   provide: APP_GUARD,
    //   useClass: GqlJwtAuthGuard,
    // },
  ],
  exports: [UsersService],
})
export class UsersModule {}

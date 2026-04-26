import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AppResolver } from './app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { DataResponseInterceptor } from './common/interceptor/data-response/data-response.interceptor';
import { CabinsModule } from './cabins/cabins.module';
import { BookingsModule } from './bookings/bookings.module';
import { SettingsModule } from './settings/settings.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import databaseConfig from './config/database.config';
import { GraphQLFormattedError } from 'graphql';
import { GqlJwtAuthGuard } from './auth/guards/gql-jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('dataBaseConfig.databaseNeonUrl'),
        ssl: { rejectUnauthorized: false },
        // host: configService.get('dataBaseConfig.host'),
        // port: configService.get('dataBaseConfig.port'),
        // username: configService.get('dataBaseConfig.user'),
        // password: configService.get('dataBaseConfig.password'),
        // password: 'a5461230',
        // database: configService.get('dataBaseConfig.name'),
        autoLoadEntities: configService.get('dataBaseConfig.autoLoadEntities'),
        synchronize: configService.get('dataBaseConfig.synchronize'),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
        // 1. Create a safe interface for the NestJS error structure
        interface NestJsError {
          statusCode?: number;
          message?: string | string[];
        }

        // 2. Safely cast the unknown error to the structure we expect
        const graphQLError = error as {
          extensions?: { originalError?: NestJsError };
        };
        const originalError = graphQLError?.extensions?.originalError;

        return {
          message:
            (Array.isArray(originalError?.message)
              ? originalError?.message[0]
              : originalError?.message) || formattedError.message,
          extensions: {
            code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
            status: originalError?.statusCode || 500,
          },
        };
      },

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: ({ req }) => ({ req }),
      // autoSchemaFile: true,
      // typePaths: ['./**/*.graphql'],
    }),
    CabinsModule,
    BookingsModule,
    SettingsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: GqlJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: DataResponseInterceptor,
    // },
  ],
  // exports: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { User } from './entities/user.entity';
import { ProjectModule } from './modules/project.module';
import { Project } from './entities/project.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard'
import { ProjectUsersModule } from './modules/project-users.module';
import { ProjectUsers } from './entities/project-users.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUsers],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProjectModule,
    ProjectUsersModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
}],
})
export class AppModule { }

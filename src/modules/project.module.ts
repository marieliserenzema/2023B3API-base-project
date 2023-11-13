import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../guards/auth.guard';
import { APP_GUARD, } from '@nestjs/core';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/project.dt';
import { ProjectController } from '../controllers/project.controller';
import { ProjectService } from '../services/project.service';


@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    controllers: [ProjectController],
    providers: [ProjectService, CreateProjectDto,],
    exports: [ProjectService]
})
export class ProjectModule { }
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/project.dto';
import { ProjectController } from '../controllers/project.controller';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Project, User])],
    controllers: [ProjectController],
    providers: [ProjectService, CreateProjectDto, UserService],
    exports: [ProjectService],
})
export class ProjectModule { }
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectUsers } from "../entities/project-users.entity";
import { ProjectUsersService } from "../services/project-users.service";
import { ProjectUsersController } from "../controllers/project-users.controller";
import { User } from "../entities/user.entity";
import { Project } from "../entities/project.entity";
import { create } from "domain";
import { CreateProjectUsersDto } from "../dto/project-users.dto";
import { UserService } from "../services/user.service";
import { ProjectService } from "../services/project.service";


@Module({
    imports : [TypeOrmModule.forFeature([ProjectUsers, User, Project])],
    controllers : [ProjectUsersController],
    providers : [ProjectUsersService, CreateProjectUsersDto, UserService, ProjectService],
    exports : [ProjectUsersService]

})
export class ProjectUsersModule {}
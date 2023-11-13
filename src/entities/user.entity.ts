import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export enum UserRole {
    Employee = 'Employee',
    Admin = 'Admin',
    ProjectManager = 'ProjectManager'
}

@Entity('user')
@Unique(['username', 'email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ default: 'Employee', enum: UserRole })
    role: UserRole;
}


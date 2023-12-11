import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ProjectUsers {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ type: 'timestamp' })
    public startDate!: Date;

    @Column({ type: 'timestamp' })
    public endDate!: Date;

    @Column({ type: 'uuid' })
    public projectId!: string;

    @Column({ type: 'uuid' })
    public userId!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false })
    public createdAt!: Date;

}
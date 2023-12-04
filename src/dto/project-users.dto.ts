import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectUsersDto {
  @IsDateString()
  @IsNotEmpty()
  public startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  public endDate: Date;

  @IsUUID()
  @IsNotEmpty()
  public projectId: string;

  @IsUUID()
  @IsNotEmpty()
  public userId: string;
}
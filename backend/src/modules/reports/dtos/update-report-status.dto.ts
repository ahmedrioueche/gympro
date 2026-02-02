import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportStatus } from '../schemas/report.schema';

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  @IsNotEmpty()
  status: ReportStatus;
}

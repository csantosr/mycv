import { Injectable } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDTO: CreateReportDTO) {
    const report = this.repo.create(reportDTO);

    return report;
  }
}

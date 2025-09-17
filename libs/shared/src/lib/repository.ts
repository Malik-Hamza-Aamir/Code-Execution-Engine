import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { SubmitCodeDto } from './dto/submit-code/submit-code.dto';

@Injectable()
export class SharedRepository {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>
  ) {}

  async updateSubmission(submissionId: number, body: object) {
    try {
      const submission = await this.submissionRepository.update(submissionId, body);
      return submission;
    } catch (error: any) {
      console.log('[error]', error);
      throw new InternalServerErrorException(
        'Something went wrong creating submission'
      );
    }
  }

  async createSubmission(data: SubmitCodeDto) {
    try {
      let obj = { ...data, status: 'Queued' };
      const submission = this.submissionRepository.create(obj);
      return await this.submissionRepository.save(submission);
    } catch (error: any) {
      console.log('[error]', error);
      throw new InternalServerErrorException(
        'Something went wrong creating submission'
      );
    }
  }

  async findSubmissionById(id: number) {
    try {
      return await this.submissionRepository.findOne({
        where: {
          id: id,
          status: Not(In(['QUEUED', 'RUNNING'])),
        },
      });
    } catch (error: any) {
      console.log('[find submission error]', error);
      throw new InternalServerErrorException(
        'Something went wrong while finding submission'
      );
    }
  }
}

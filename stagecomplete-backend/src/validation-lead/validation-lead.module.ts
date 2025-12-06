import { Module } from '@nestjs/common';
import { ValidationLeadService } from './validation-lead.service';
import { ValidationLeadController } from './validation-lead.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ValidationLeadController],
  providers: [ValidationLeadService],
  exports: [ValidationLeadService],
})
export class ValidationLeadModule {}

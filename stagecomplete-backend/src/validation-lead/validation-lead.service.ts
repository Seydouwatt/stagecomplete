import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateValidationLeadDto } from './dto/create-validation-lead.dto';
import { ValidationLeadStatus } from '@prisma/client';

@Injectable()
export class ValidationLeadService {
  constructor(private prisma: PrismaService) {}

  async create(createValidationLeadDto: CreateValidationLeadDto) {
    return this.prisma.validationLead.create({
      data: {
        ...createValidationLeadDto,
      },
    });
  }

  async findAll(status?: ValidationLeadStatus) {
    const where = status ? { status } : {};

    return this.prisma.validationLead.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.validationLead.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: ValidationLeadStatus, notes?: string) {
    return this.prisma.validationLead.update({
      where: { id },
      data: {
        status,
        ...(notes && { notes }),
      },
    });
  }

  async updateScore(id: string, score: number) {
    return this.prisma.validationLead.update({
      where: { id },
      data: { score },
    });
  }

  async getStats() {
    const total = await this.prisma.validationLead.count();
    const byStatus = await this.prisma.validationLead.groupBy({
      by: ['status'],
      _count: true,
    });
    const byType = await this.prisma.validationLead.groupBy({
      by: ['type'],
      _count: true,
    });

    return {
      total,
      byStatus: byStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
      byType: byType.map(item => ({
        type: item.type,
        count: item._count,
      })),
    };
  }
}

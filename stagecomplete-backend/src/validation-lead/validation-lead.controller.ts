import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ValidationLeadService } from './validation-lead.service';
import { CreateValidationLeadDto } from './dto/create-validation-lead.dto';
import { ValidationLeadStatus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('validation-leads')
export class ValidationLeadController {
  constructor(private readonly validationLeadService: ValidationLeadService) {}

  /**
   * Public endpoint - Create a new validation lead from landing page
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createValidationLeadDto: CreateValidationLeadDto) {
    return this.validationLeadService.create(createValidationLeadDto);
  }

  /**
   * Admin only - Get all validation leads (TODO: Add role check for ADMIN)
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query('status') status?: ValidationLeadStatus) {
    return this.validationLeadService.findAll(status);
  }

  /**
   * Admin only - Get stats (TODO: Add role check for ADMIN)
   */
  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  async getStats() {
    return this.validationLeadService.getStats();
  }

  /**
   * Admin only - Get one validation lead (TODO: Add role check for ADMIN)
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    return this.validationLeadService.findOne(id);
  }

  /**
   * Admin only - Update lead status (TODO: Add role check for ADMIN)
   */
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ValidationLeadStatus; notes?: string },
  ) {
    return this.validationLeadService.updateStatus(id, body.status, body.notes);
  }

  /**
   * Admin only - Update lead score (TODO: Add role check for ADMIN)
   */
  @Patch(':id/score')
  @UseGuards(AuthGuard('jwt'))
  async updateScore(
    @Param('id') id: string,
    @Body() body: { score: number },
  ) {
    return this.validationLeadService.updateScore(id, body.score);
  }
}

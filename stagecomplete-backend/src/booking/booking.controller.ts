import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(req.user.userId, dto);
  }

  @Get()
  async findAll(@Request() req, @Query() filters: any) {
    return this.bookingService.findAllForArtist(req.user.userId, filters);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.bookingService.getStats(req.user.userId);
  }

  @Get('calendar/:year/:month')
  async getCalendar(
    @Request() req,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.bookingService.getMonthlyCalendar(
      req.user.userId,
      parseInt(year, 10),
      parseInt(month, 10),
    );
  }

  @Get('export/ical')
  async exportIcal(@Request() req, @Res() res: Response) {
    const { content, filename } = await this.bookingService.exportToIcal(
      req.user.userId,
    );

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.bookingService.findOne(req.user.userId, id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id') id: string) {
    await this.bookingService.remove(req.user.userId, id);
  }
}

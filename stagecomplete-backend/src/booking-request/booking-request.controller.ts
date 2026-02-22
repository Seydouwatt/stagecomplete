import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingRequestService } from './booking-request.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { UpdateBookingRequestDto } from './dto/update-booking-request.dto';
import { RespondBookingRequestDto } from './dto/respond-booking-request.dto';

@Controller('booking-requests')
@UseGuards(AuthGuard('jwt'))
export class BookingRequestController {
  constructor(private readonly bookingRequestService: BookingRequestService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateBookingRequestDto) {
    return this.bookingRequestService.create(req.user.userId, dto);
  }

  @Get()
  async findAll(@Request() req, @Query('status') status?: string) {
    return this.bookingRequestService.findAll(req.user.userId, status ? { status } : undefined);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.bookingRequestService.getStats(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.bookingRequestService.findOne(req.user.userId, id);
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateBookingRequestDto) {
    return this.bookingRequestService.update(req.user.userId, id, dto);
  }

  @Put(':id/respond')
  async respond(@Request() req, @Param('id') id: string, @Body() dto: RespondBookingRequestDto) {
    return this.bookingRequestService.respond(req.user.userId, id, dto);
  }
}

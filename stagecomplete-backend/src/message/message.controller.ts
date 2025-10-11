import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateMessageDto) {
    return this.messageService.create(req.user.userId, dto);
  }

  @Get()
  async findByEvent(@Request() req, @Query('eventId') eventId: string) {
    return this.messageService.findByEvent(req.user.userId, eventId);
  }

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.messageService.markAsRead(req.user.userId, id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.messageService.getUnreadCount(req.user.userId);
  }
}

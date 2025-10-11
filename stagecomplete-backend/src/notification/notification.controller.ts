import { Controller, Get, Put, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@Request() req, @Query('isRead') isRead?: string) {
    const filters = isRead !== undefined ? { isRead: isRead === 'true' } : undefined;
    return this.notificationService.findAll(req.user.userId, filters);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.userId);
  }

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user.userId, id);
  }

  @Put('read-all')
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.notificationService.delete(req.user.userId, id);
  }
}

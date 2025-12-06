import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArtistModule } from './artist/artist.module';
import { ProfileModule } from './profile/profile.module';
import { HealthModule } from './health/health.module';
import { PublicModule } from './public/public.module';
import { SearchModule } from './search/search.module';
import { BookingModule } from './booking/booking.module';
import { MessageModule } from './message/message.module';
import { BookingRequestModule } from './booking-request/booking-request.module';
import { NotificationModule } from './notification/notification.module';
import { ValidationLeadModule } from './validation-lead/validation-lead.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    ArtistModule,
    ProfileModule,
    HealthModule,
    PublicModule,
    SearchModule, // Advanced search with full-text capabilities
    BookingModule, MessageModule, BookingRequestModule, NotificationModule, // Artist calendar and bookings management
    ValidationLeadModule, // Lean Startup validation - Landing page leads
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

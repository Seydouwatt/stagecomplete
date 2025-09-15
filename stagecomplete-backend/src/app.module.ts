import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArtistModule } from './artist/artist.module';
import { ProfileModule } from './profile/profile.module';
import { HealthModule } from './health/health.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [PrismaModule, AuthModule, ArtistModule, ProfileModule, HealthModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

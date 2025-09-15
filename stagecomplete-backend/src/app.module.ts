import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArtistModule } from './artist/artist.module';
import { HealthModule } from './health/health.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [PrismaModule, AuthModule, ArtistModule, HealthModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PublicController],
})
export class PublicModule {}
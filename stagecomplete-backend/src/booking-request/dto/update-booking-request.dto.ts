import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateBookingRequestDto {
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  message?: string;
}

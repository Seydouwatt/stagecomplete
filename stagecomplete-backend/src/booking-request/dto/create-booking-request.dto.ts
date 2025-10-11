import { IsString, IsDateString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBookingRequestDto {
  @IsString()
  @IsNotEmpty()
  artistId: string;

  @IsDateString()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

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

import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsArray, ValidateIf } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @ValidateIf((o) => o.endDate !== '' && o.endDate != null)
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsEnum(['PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status?: string;

  @IsString()
  eventType: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

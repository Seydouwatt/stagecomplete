import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidationLeadType } from '@prisma/client';

export class CreateValidationLeadDto {
  @IsEnum(ValidationLeadType)
  @IsNotEmpty()
  type: ValidationLeadType;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  // Venue specific fields
  @IsString()
  @IsOptional()
  venueName?: string;

  @IsString()
  @IsOptional()
  venueType?: string;

  @IsString()
  @IsOptional()
  currentBookingMethod?: string;

  @IsString()
  @IsOptional()
  averageBookingsPerMonth?: string;

  @IsString()
  @IsOptional()
  venueMainPainPoint?: string;

  @IsString()
  @IsOptional()
  venueMaxBudget?: string;

  // Artist specific fields
  @IsString()
  @IsOptional()
  artistName?: string;

  @IsString()
  @IsOptional()
  artistType?: string;

  @IsString()
  @IsOptional()
  discipline?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  currentPromotion?: string;

  @IsString()
  @IsOptional()
  monthlyGigs?: string;

  @IsString()
  @IsOptional()
  desiredPrice?: string;

  @IsString()
  @IsOptional()
  artistMainGoal?: string;

  @IsString()
  @IsOptional()
  source?: string;
}

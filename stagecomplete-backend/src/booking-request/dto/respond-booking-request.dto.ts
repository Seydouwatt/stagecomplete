import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RespondBookingRequestDto {
  @IsEnum(['accept', 'decline', 'cancel'])
  action: 'accept' | 'decline' | 'cancel';

  @IsOptional()
  @IsString()
  reason?: string;
}

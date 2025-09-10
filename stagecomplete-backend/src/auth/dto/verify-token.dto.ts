import { JwtPayload } from './jwt-payload.dto';

export interface VerifyTokenResponseDto {
  valid: boolean;
  message: string;
  payload?: JwtPayload; // présent seulement si valid = true
}

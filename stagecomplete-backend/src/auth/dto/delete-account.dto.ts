import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({
    description: 'Mot de passe actuel pour confirmer la suppression du compte',
    example: 'mon_mot_de_passe_actuel',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  currentPassword: string;
}

export class DeleteAccountResponseDto {
  @ApiProperty({
    description: 'Message de confirmation de la suppression',
    example: 'Votre compte a été supprimé avec succès',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp de la suppression',
    example: '2024-01-01T12:00:00.000Z',
  })
  deletedAt: string;
}
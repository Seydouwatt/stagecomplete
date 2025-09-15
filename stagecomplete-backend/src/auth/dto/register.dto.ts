import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @ApiProperty({
    description: 'Mot de passe sécurisé avec au moins une majuscule, une minuscule et un chiffre ou caractère spécial',
    example: 'MonMotDePasse123!',
    minLength: 6,
    pattern: '/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/'
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre ou caractère spécial',
  })
  password: string;

  @ApiProperty({
    description: 'Nom complet de l\'utilisateur',
    example: 'Jean Dupont',
    minLength: 2
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur sur la plateforme',
    enum: Role,
    example: Role.ARTIST,
    enumName: 'Role'
  })
  @IsEnum(Role, { message: 'Le rôle doit être ARTIST ou VENUE' })
  role: Role;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class ProfileDto {
  @ApiProperty({
    description: 'Identifiant unique du profil',
    example: 'clm987654321'
  })
  id: string;

  @ApiProperty({
    description: 'Nom complet de l\'utilisateur',
    example: 'Jean Dupont'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Biographie de l\'utilisateur',
    example: 'Musicien professionnel spécialisé dans le jazz moderne...'
  })
  bio?: string;

  @ApiPropertyOptional({
    description: 'URL de l\'avatar de l\'utilisateur',
    example: 'https://example.com/avatar.jpg'
  })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Localisation de l\'utilisateur',
    example: 'Paris, France'
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'Site web de l\'utilisateur',
    example: 'https://monsite.com'
  })
  website?: string;

  @ApiPropertyOptional({
    description: 'Liens vers les réseaux sociaux',
    example: {
      instagram: 'https://instagram.com/user',
      facebook: 'https://facebook.com/user',
      youtube: 'https://youtube.com/c/user'
    }
  })
  socialLinks?: any;

  @ApiProperty({
    description: 'Date de création du profil',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière modification du profil',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}

export class UserDto {
  @ApiProperty({
    description: 'Identifiant unique de l\'utilisateur',
    example: 'clm123456789'
  })
  id: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: Role,
    example: Role.ARTIST
  })
  role: Role;

  @ApiPropertyOptional({
    description: 'Profil détaillé de l\'utilisateur',
    type: ProfileDto
  })
  profile?: ProfileDto;

  @ApiProperty({
    description: 'Date de création du compte',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière modification du compte',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT d\'authentification',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'Informations de l\'utilisateur authentifié',
    type: UserDto
  })
  user: UserDto;

  @ApiPropertyOptional({
    description: 'Message de succès',
    example: 'Connexion réussie'
  })
  message?: string;
}

export class AuthErrorDto {
  @ApiProperty({
    description: 'Code de statut HTTP',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    description: 'Message d\'erreur',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } }
    ],
    example: 'Email ou mot de passe incorrect'
  })
  message: string | string[];

  @ApiProperty({
    description: 'Type d\'erreur',
    example: 'Bad Request'
  })
  error: string;

  @ApiProperty({
    description: 'Horodatage de l\'erreur',
    example: '2024-01-15T10:30:00.000Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Chemin de la requête',
    example: '/api/auth/login'
  })
  path: string;
}

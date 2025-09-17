import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUrl,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SocialLinksDto {
  @ApiProperty({
    description: 'URL du profil Instagram',
    example: 'https://instagram.com/artistname',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL Instagram invalide' })
  instagram?: string;

  @ApiProperty({
    description: 'URL du profil Facebook',
    example: 'https://facebook.com/artistname',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL Facebook invalide' })
  facebook?: string;

  @ApiProperty({
    description: 'URL du profil Twitter',
    example: 'https://twitter.com/artistname',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL Twitter invalide' })
  twitter?: string;

  @ApiProperty({
    description: 'URL du profil LinkedIn',
    example: 'https://linkedin.com/in/artistname',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL LinkedIn invalide' })
  linkedin?: string;

  @ApiProperty({
    description: 'URL de la chaîne YouTube',
    example: 'https://youtube.com/c/artistname',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL YouTube invalide' })
  youtube?: string;

  @ApiProperty({
    description: 'URL du profil TikTok',
    example: 'https://tiktok.com/@artistname',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL TikTok invalide' })
  tiktok?: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: "Nom complet de l'utilisateur",
    example: 'Jean Dupont',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
  name?: string;

  @ApiProperty({
    description: 'Biographie ou description personnelle',
    example: 'Musicien professionnel spécialisé dans le jazz moderne...',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La biographie doit être une chaîne de caractères' })
  @MaxLength(500, {
    message: 'La biographie ne peut pas dépasser 500 caractères',
  })
  bio?: string;

  @ApiProperty({
    description: "URL ou données base64 de l'avatar",
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Avatar doit être une chaîne de caractères' })
  avatar?: string;

  @ApiProperty({
    description: 'Numéro de téléphone',
    example: '+33123456789',
    minLength: 10,
    maxLength: 15,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @MinLength(10, {
    message: 'Le numéro de téléphone doit contenir au moins 10 chiffres',
  })
  @MaxLength(15, {
    message: 'Le numéro de téléphone ne peut pas dépasser 15 chiffres',
  })
  phone?: string;

  @ApiProperty({
    description: 'Localisation géographique',
    example: 'Paris, France',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La localisation doit être une chaîne de caractères' })
  @MaxLength(100, {
    message: 'La localisation ne peut pas dépasser 100 caractères',
  })
  location?: string;

  @ApiProperty({
    description: 'Site web personnel ou professionnel',
    example: 'https://monsite.com',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL du site web invalide' })
  website?: string;

  @ApiProperty({
    description: 'Liens vers les réseaux sociaux',
    type: SocialLinksDto,
    required: false,
    example: {
      instagram: 'https://instagram.com/artistname',
      facebook: 'https://facebook.com/artistname',
      twitter: 'https://twitter.com/artistname',
      youtube: 'https://youtube.com/c/artistname',
    },
  })
  @IsOptional()
  @IsObject({ message: 'Les liens sociaux doivent être un objet valide' })
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}

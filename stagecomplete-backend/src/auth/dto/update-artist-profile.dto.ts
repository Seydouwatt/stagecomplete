import {
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  IsBoolean,
  IsObject,
  Min,
  Max,
  MaxLength,
  IsEnum,
  ArrayMaxSize,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum Experience {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum ArtistSpecialty {
  CONCERT = 'CONCERT',
  STUDIO = 'STUDIO',
  TEACHING = 'TEACHING',
  WEDDING = 'WEDDING',
  CORPORATE = 'CORPORATE',
  PRIVATE = 'PRIVATE',
}

export enum ArtistType {
  SOLO = 'SOLO',
  BAND = 'BAND',
  THEATER_GROUP = 'THEATER_GROUP',
  COMEDY_GROUP = 'COMEDY_GROUP',
  ORCHESTRA = 'ORCHESTRA',
  CHOIR = 'CHOIR',
  OTHER = 'OTHER',
}

class PriceDetailsDto {
  @ApiPropertyOptional({ description: 'Prix pour concerts', example: 500 })
  @IsOptional()
  @IsInt()
  @Min(0)
  concert?: number;

  @ApiPropertyOptional({
    description: 'Prix pour événements privés',
    example: 800,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  private?: number;

  @ApiPropertyOptional({ description: 'Prix pour mariages', example: 1000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  wedding?: number;

  @ApiPropertyOptional({ description: 'Conditions et détails supplémentaires' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  conditions?: string;
}

class SocialLinksDto {
  @ApiPropertyOptional({ description: 'Lien Spotify' })
  @IsOptional()
  @IsUrl({}, { message: 'Le lien Spotify doit être une URL valide' })
  spotify?: string;

  @ApiPropertyOptional({ description: 'Lien SoundCloud' })
  @IsOptional()
  @IsUrl({}, { message: 'Le lien SoundCloud doit être une URL valide' })
  soundcloud?: string;

  @ApiPropertyOptional({ description: 'Lien YouTube' })
  @IsOptional()
  @IsUrl({}, { message: 'Le lien YouTube doit être une URL valide' })
  youtube?: string;

  @ApiPropertyOptional({ description: 'Lien Instagram' })
  @IsOptional()
  @IsUrl({}, { message: 'Le lien Instagram doit être une URL valide' })
  instagram?: string;

  @ApiPropertyOptional({ description: 'Site web personnel' })
  @IsOptional()
  @IsUrl({}, { message: 'Le site web doit être une URL valide' })
  website?: string;
}

export class UpdateArtistProfileDto {
  // ===== GENERAL INFORMATION (IDENTITY) =====
  @ApiPropertyOptional({
    description: "Nom de l'artiste ou du groupe",
    example: 'Les Étoiles Filantes',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  artistName?: string;

  @ApiPropertyOptional({
    description: 'Photo de couverture/bannière (base64)',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJ...',
    maxLength: 200000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200000)
  coverPhoto?: string;

  @ApiPropertyOptional({
    description: "Logo/image d'identité (base64)",
    example: 'data:image/png;base64,iVBORw0KGgoAAA...',
    maxLength: 200000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200000)
  logo?: string;

  @ApiPropertyOptional({
    description: 'Ville/Pays de base',
    example: 'Lyon, France',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  baseLocation?: string;

  @ApiPropertyOptional({
    description: 'Année de création/début de carrière',
    example: 2018,
    minimum: 1900,
    maximum: 2030,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2030)
  foundedYear?: number;

  // ===== BASIC INFO =====
  @ApiPropertyOptional({
    description: 'Genres musicaux',
    example: ['Rock', 'Blues', 'Jazz'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  genres?: string[];

  @ApiPropertyOptional({
    description: 'Instruments pratiqués',
    example: ['Guitare', 'Piano', 'Chant'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(15)
  instruments?: string[];

  @ApiPropertyOptional({
    description: 'Fourchette de prix',
    example: '500-1000',
    enum: ['0-200', '200-500', '500-1000', '1000-2000', '2000+'],
  })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({
    description: "Niveau d'expérience",
    enum: Experience,
  })
  @IsOptional()
  @IsEnum(Experience, {
    message: 'Experience must be BEGINNER, INTERMEDIATE, or PROFESSIONAL',
  })
  experience?: Experience;

  @ApiPropertyOptional({
    description: "Années d'activité musicale",
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  yearsActive?: number;

  // Extended Profile
  @ApiPropertyOptional({
    description: 'Biographie artistique détaillée',
    example: "Musicien professionnel avec 10 ans d'expérience...",
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'La biographie artistique ne peut pas dépasser 2000 caractères',
  })
  artisticBio?: string;

  @ApiPropertyOptional({
    description: 'Spécialités artistiques',
    example: ['CONCERT', 'WEDDING'],
    enum: ArtistSpecialty,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ArtistSpecialty, {
    each: true,
    message: 'Chaque spécialité doit être une valeur valide',
  })
  @ArrayMaxSize(6)
  specialties?: ArtistSpecialty[];

  @ApiPropertyOptional({
    description: 'Équipements possédés',
    example: ['Micro', 'Amplificateur', 'Système son'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  equipment?: string[];

  @ApiPropertyOptional({
    description: 'Équipements requis de la venue',
    example: ['Scène', 'Éclairage', 'Système son'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(15)
  requirements?: string[];

  // Pricing & Conditions
  @ApiPropertyOptional({
    description: 'Détails des tarifs par type de prestation',
    type: PriceDetailsDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PriceDetailsDto)
  priceDetails?: PriceDetailsDto;

  @ApiPropertyOptional({
    description: 'Rayon de déplacement en kilomètres',
    example: 50,
    minimum: 0,
    maximum: 500,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(500)
  travelRadius?: number;

  // Social & Media Links
  @ApiPropertyOptional({
    description: 'Liens vers les réseaux sociaux et plateformes',
    type: SocialLinksDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  // Portfolio & Visibility
  @ApiPropertyOptional({
    description:
      'Portfolio multimédia (photos, vidéos, audio en base64 ou URLs)',
    example: {
      photos: ['data:image/jpeg;base64,...'],
      videos: ['https://youtube.com/watch?v=...'],
      audio: ['data:audio/mp3;base64,...'],
    },
  })
  @IsOptional()
  @IsObject()
  portfolio?: {
    photos?: string[];
    videos?: string[];
    audio?: string[];
  };

  @ApiPropertyOptional({
    description: 'Profil visible publiquement',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Slug personnalisé pour URL publique',
    example: 'jean-dupont-music',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  publicSlug?: string;

  // Group/Solo Management
  @ApiPropertyOptional({
    description: "Type d'artiste (solo, groupe, etc)",
    example: 'BAND',
    enum: ArtistType,
  })
  @IsOptional()
  @IsEnum(ArtistType)
  artistType?: ArtistType;

  @ApiPropertyOptional({
    description: 'Nombre de membres dans le groupe',
    example: 4,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  memberCount?: number;
}

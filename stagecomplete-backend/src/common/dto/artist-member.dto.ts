import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
  IsEmail,
  MaxLength,
  ArrayMaxSize,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SocialLinksDto {
  @ApiPropertyOptional({ example: 'https://instagram.com/artist' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/artist' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/artist' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  twitter?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/artist' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  youtube?: string;

  // Add index signature to make it compatible with Prisma Json type
  [key: string]: string | undefined;
}

export class CreateArtistMemberDto {
  @ApiProperty({ example: 'John Doe', description: 'Nom du membre' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Guitariste principal',
    description: 'Rôle dans le groupe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @ApiPropertyOptional({
    example: 'Guitariste passionné depuis 15 ans...',
    description: 'Bio personnelle du membre',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJ...',
    description: 'Photo du membre en base64',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200000) // Limite pour base64 image
  avatar?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Email personnel du membre',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    example: '+33123456789',
    description: 'Téléphone personnel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    type: SocialLinksDto,
    description: 'Liens vers réseaux sociaux du membre',
  })
  @IsOptional()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @ApiPropertyOptional({
    example: ['Guitare électrique', 'Chant'],
    description: 'Instruments joués par ce membre',
    maxItems: 10,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  instruments?: string[];

  @ApiPropertyOptional({
    example: 'PROFESSIONAL',
    description: "Niveau d'expérience du membre",
    enum: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL', 'EXPERT'],
  })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({
    example: 15,
    description: "Années d'expérience du membre",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  yearsActive?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Membre fondateur du groupe',
  })
  @IsOptional()
  @IsBoolean()
  isFounder?: boolean;

  @ApiPropertyOptional({
    example: '2020-01-15T10:00:00.000Z',
    description: "Date d'adhésion au groupe",
  })
  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @ApiPropertyOptional({ example: true, description: 'Membre actif ou non' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateArtistMemberDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Nom du membre' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'Guitariste principal',
    description: 'Rôle dans le groupe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @ApiPropertyOptional({
    example: 'Guitariste passionné depuis 15 ans...',
    description: 'Bio personnelle du membre',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJ...',
    description: 'Photo du membre en base64',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200000)
  avatar?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Email personnel du membre',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    example: '+33123456789',
    description: 'Téléphone personnel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    type: SocialLinksDto,
    description: 'Liens vers réseaux sociaux du membre',
  })
  @IsOptional()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @ApiPropertyOptional({
    example: ['Guitare électrique', 'Chant'],
    description: 'Instruments joués par ce membre',
    maxItems: 10,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  instruments?: string[];

  @ApiPropertyOptional({
    example: 'PROFESSIONAL',
    description: "Niveau d'expérience du membre",
    enum: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL', 'EXPERT'],
  })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({
    example: 15,
    description: "Années d'expérience du membre",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  yearsActive?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Membre fondateur du groupe',
  })
  @IsOptional()
  @IsBoolean()
  isFounder?: boolean;

  @ApiPropertyOptional({
    example: '2020-01-15T10:00:00.000Z',
    description: "Date d'adhésion au groupe",
  })
  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @ApiPropertyOptional({ example: true, description: 'Membre actif ou non' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

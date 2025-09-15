import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Param,
  UseGuards,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  VerifyTokenResponseDto,
  UpdateProfileDto,
  UpdateArtistProfileDto,
  ArtistType,
} from './dto';
import { CreateArtistMemberDto, UpdateArtistMemberDto } from './dto/artist-member.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from './decorators';
// import { ProfileService } from '../profile/profile.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    // private profileService: ProfileService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Inscription d\'un nouvel utilisateur',
    description: 'Crée un nouveau compte utilisateur avec les informations fournies'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Données d\'inscription',
    examples: {
      artist: {
        summary: 'Inscription artiste',
        description: 'Exemple d\'inscription pour un artiste',
        value: {
          email: 'artiste@example.com',
          password: 'MonMotDePasse123!',
          name: 'Jean Dupont',
          role: 'ARTIST'
        }
      },
      venue: {
        summary: 'Inscription lieu',
        description: 'Exemple d\'inscription pour un lieu de spectacle',
        value: {
          email: 'venue@example.com',
          password: 'MonMotDePasse123!',
          name: 'Salle de Concert Olympia',
          role: 'VENUE'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Inscription réussie',
    type: AuthResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Données d\'inscription invalides',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Données de validation invalides' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'email' },
              errors: {
                type: 'array',
                items: { type: 'string' },
                example: ['Email invalide']
              }
            }
          }
        }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur et retourne un token JWT'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Identifiants de connexion',
    examples: {
      example1: {
        summary: 'Connexion standard',
        description: 'Exemple de connexion avec email et mot de passe',
        value: {
          email: 'user@example.com',
          password: 'MonMotDePasse123!'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Connexion réussie',
    type: AuthResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'Identifiants incorrects',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Email ou mot de passe incorrect' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Données de connexion invalides',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Données de validation invalides' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'email' },
              errors: {
                type: 'array',
                items: { type: 'string' },
                example: ['Email requis']
              }
            }
          }
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer le profil de l\'utilisateur connecté',
    description: 'Retourne les informations complètes du profil de l\'utilisateur authentifié'
  })
  @ApiOkResponse({
    description: 'Profil utilisateur récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Profil récupéré avec succès' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clm123456789' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['ARTIST', 'VENUE'], example: 'ARTIST' },
            profile: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clm987654321' },
                name: { type: 'string', example: 'Jean Dupont' },
                bio: { type: 'string', example: 'Musicien professionnel...' },
                avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
                location: { type: 'string', example: 'Paris, France' },
                phone: { type: 'string', example: '+33123456789' },
                website: { type: 'string', example: 'https://monsite.com' },
                socialLinks: { type: 'object', example: { instagram: 'https://instagram.com/user' } },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT manquant ou invalide',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async getProfile(@GetUser() user: AuthenticatedUser) {
    try {
      // Utilisation directe d'AuthService pour éviter les erreurs TypeScript
      const userProfile = await this.authService.findUserById(user.userId);
      return {
        message: 'Profil récupéré avec succès',
        user: userProfile,
      };
    } catch (error) {
      return {
        message: 'Profil récupéré avec succès',
        user: user,
      };
    }
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour le profil utilisateur',
    description: 'Met à jour les informations du profil de l\'utilisateur authentifié'
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Données de mise à jour du profil',
    examples: {
      example1: {
        summary: 'Mise à jour complète',
        description: 'Exemple de mise à jour avec tous les champs',
        value: {
          name: 'Jean Dupont',
          bio: 'Musicien professionnel spécialisé dans le jazz moderne avec 15 ans d\'expérience...',
          location: 'Paris, France',
          phone: '+33123456789',
          website: 'https://jeandupont-music.com',
          socialLinks: {
            instagram: 'https://instagram.com/jeandupont_music',
            facebook: 'https://facebook.com/jeandupont.music',
            youtube: 'https://youtube.com/c/jeandupont'
          }
        }
      },
      example2: {
        summary: 'Mise à jour partielle',
        description: 'Exemple de mise à jour de quelques champs seulement',
        value: {
          bio: 'Nouvelle biographie mise à jour',
          location: 'Lyon, France'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Profil mis à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Profil mis à jour avec succès' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clm123456789' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['ARTIST', 'VENUE'], example: 'ARTIST' },
            profile: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clm987654321' },
                name: { type: 'string', example: 'Jean Dupont' },
                bio: { type: 'string', example: 'Musicien professionnel...' },
                avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
                location: { type: 'string', example: 'Paris, France' },
                phone: { type: 'string', example: '+33123456789' },
                website: { type: 'string', example: 'https://monsite.com' },
                socialLinks: { type: 'object', example: { instagram: 'https://instagram.com/user' } },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Données de validation invalides',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Erreur lors de la mise à jour du profil' },
        error: { 
          type: 'object',
          example: {
            field: 'phone',
            errors: ['Le numéro de téléphone doit contenir au moins 10 chiffres']
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT manquant ou invalide',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async updateProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      // Version simplifiée temporaire pour test
      const updatedProfile = await this.authService.updateUserProfile(
        user.userId,
        updateProfileDto,
      );

      return {
        message: 'Profil mis à jour avec succès',
        user: updatedProfile,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Erreur lors de la mise à jour du profil',
        error: error.message || 'Erreur inconnue',
      });
    }
  }

  @Post('verify-token')
  @ApiOperation({
    summary: 'Vérifier la validité d\'un token JWT',
    description: 'Vérifie si un token JWT est valide et non expiré'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'Token JWT à vérifier',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      },
      required: ['token']
    }
  })
  @ApiOkResponse({
    description: 'Résultat de la vérification du token',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        payload: {
          type: 'object',
          description: 'Payload du token JWT si valide',
          example: {
            userId: 'clm123456789',
            email: 'user@example.com',
            role: 'ARTIST'
          }
        },
        message: { type: 'string', example: 'Token valide' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Token invalide ou expiré',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Token invalide ou expiré' }
      }
    }
  })
  async verifyToken(
    @Body('token') token: string,
  ): Promise<VerifyTokenResponseDto> {
    try {
      const payload = await this.authService.verifyJwtToken(token);
      return {
        valid: true,
        payload: payload,
        message: 'Token valide',
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Token invalide ou expiré',
      };
    }
  }

  @Post('check-email')
  @ApiOperation({
    summary: 'Vérifier la disponibilité d\'un email',
    description: 'Vérifie si une adresse email est déjà utilisée sur la plateforme'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Adresse email à vérifier',
          example: 'user@example.com'
        }
      },
      required: ['email']
    }
  })
  @ApiOkResponse({
    description: 'Résultat de la vérification de l\'email',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Email disponible' }
      }
    }
  })
  async checkEmail(@Body('email') email: string) {
    const exists = await this.authService.emailExists(email);
    return {
      exists,
      message: exists ? 'Email déjà utilisé' : 'Email disponible',
    };
  }

  @Post('test-login')
  @ApiOperation({
    summary: 'Test de validation des données de connexion',
    description: 'Endpoint de test pour valider le format des données de connexion sans authentification'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Données de connexion à tester'
  })
  @ApiOkResponse({
    description: 'Validation réussie',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Validation réussie !' },
        data: {
          type: 'object',
          description: 'Données validées',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: 'MonMotDePasse123!' }
          }
        }
      }
    }
  })
  testLogin(@Body() loginDto: LoginDto) {
    return {
      message: 'Validation réussie !',
      data: loginDto,
    };
  }

  // ========== ENDPOINTS PROFIL ARTISTE ÉTENDU ==========

  @Get('artist/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer le profil artiste étendu',
    description: 'Retourne le profil artiste complet avec toutes les informations détaillées'
  })
  @ApiOkResponse({
    description: 'Profil artiste récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        artist: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            profile: { type: 'object' },
            genres: { type: 'array', items: { type: 'string' } },
            instruments: { type: 'array', items: { type: 'string' } },
            artisticBio: { type: 'string' },
            experience: { type: 'string' },
            yearsActive: { type: 'number' },
            priceRange: { type: 'string' },
            socialLinks: { type: 'object' },
            portfolio: { type: 'object' },
            isPublic: { type: 'boolean' },
            publicSlug: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Non autorisé - réservé aux artistes' })
  async getArtistProfile(@GetUser() user: AuthenticatedUser) {
    const artistProfile = await this.authService.getArtistProfile(user.userId);
    return {
      message: 'Profil artiste récupéré avec succès',
      artist: artistProfile,
    };
  }

  @Put('artist/profile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour le profil artiste étendu',
    description: 'Met à jour toutes les informations du profil artiste'
  })
  @ApiBody({
    type: UpdateArtistProfileDto,
    description: 'Données du profil artiste à mettre à jour',
    examples: {
      complete: {
        summary: 'Profil artiste complet',
        value: {
          genres: ['Rock', 'Blues', 'Jazz'],
          instruments: ['Guitare', 'Piano', 'Chant'],
          experience: 'PROFESSIONAL',
          yearsActive: 10,
          artisticBio: 'Musicien professionnel avec 10 ans d\'expérience sur scène...',
          specialties: ['CONCERT', 'WEDDING'],
          equipment: ['Guitare électrique', 'Amplificateur', 'Pédales'],
          requirements: ['Scène', 'Système son', 'Éclairage'],
          priceRange: '500-1000',
          priceDetails: {
            concert: 800,
            wedding: 1200,
            private: 600,
            conditions: 'Transport inclus dans un rayon de 50km'
          },
          travelRadius: 50,
          socialLinks: {
            spotify: 'https://open.spotify.com/artist/123',
            youtube: 'https://youtube.com/@artiste',
            instagram: 'https://instagram.com/artiste_music'
          },
          isPublic: true,
          publicSlug: 'jean-dupont-music'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Profil artiste mis à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        artist: { type: 'object' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Données invalides ou utilisateur non artiste' })
  @ApiUnauthorizedResponse({ description: 'Token JWT manquant ou invalide' })
  async updateArtistProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() updateArtistProfileDto: UpdateArtistProfileDto,
  ) {
    try {
      const updatedProfile = await this.authService.updateArtistProfile(
        user.userId,
        updateArtistProfileDto,
      );

      return {
        message: 'Profil artiste mis à jour avec succès',
        artist: updatedProfile,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Erreur lors de la mise à jour du profil artiste',
        error: error.message || 'Erreur inconnue',
      });
    }
  }

  @Post('artist/generate-slug')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Générer un slug unique pour l\'URL publique',
    description: 'Génère un slug URL friendly basé sur le nom d\'artiste'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Jean Dupont Music' }
      },
      required: ['name']
    }
  })
  @ApiOkResponse({
    description: 'Slug généré avec succès',
    schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', example: 'jean-dupont-music' }
      }
    }
  })
  async generateSlug(@Body('name') name: string) {
    const slug = await this.authService.generateUniqueSlug(name);
    return { slug };
  }

  // ===============================
  // ARTIST MEMBER MANAGEMENT ENDPOINTS
  // ===============================

  @Get('artist/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer les membres de l\'artiste',
    description: 'Récupère tous les membres actifs de l\'artiste connecté'
  })
  @ApiOkResponse({ 
    description: 'Membres récupérés avec succès',
    schema: {
      type: 'object',
      properties: {
        artist: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            artistType: { type: 'string', enum: ['SOLO', 'BAND', 'THEATER_GROUP', 'COMEDY_GROUP', 'ORCHESTRA', 'CHOIR', 'OTHER'] },
            memberCount: { type: 'number' }
          }
        },
        members: {
          type: 'array',
          items: { type: 'object' }
        }
      }
    }
  })
  async getArtistMembers(@GetUser() user: AuthenticatedUser) {
    // Récupérer l'artiste lié à l'utilisateur
    let artist = await this.authService.getArtistProfile(user.userId);
    if (!artist) {
      // Si le profil artiste n'existe pas, en créer un par défaut pour un groupe
      const defaultArtistProfile: UpdateArtistProfileDto = {
        artistType: ArtistType.BAND,
        memberCount: 5
      };
      artist = await this.authService.updateArtistProfile(user.userId, defaultArtistProfile) as any;
    }

    return this.authService.getArtistMembers(artist.id);
  }

  @Post('artist/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Ajouter un nouveau membre',
    description: 'Ajoute un nouveau membre au groupe de l\'artiste connecté'
  })
  @ApiBody({ type: CreateArtistMemberDto })
  @ApiOkResponse({ description: 'Membre créé avec succès' })
  @ApiBadRequestResponse({ description: 'Données invalides ou limite de membres atteinte' })
  async createArtistMember(@GetUser() user: AuthenticatedUser, @Body() memberData: CreateArtistMemberDto) {
    // Récupérer l'artiste lié à l'utilisateur
    let artist = await this.authService.getArtistProfile(user.userId);
    if (!artist) {
      // Si le profil artiste n'existe pas, en créer un par défaut
      const defaultArtistProfile: UpdateArtistProfileDto = {
        artistType: ArtistType.BAND,
        memberCount: 5
      };
      artist = await this.authService.updateArtistProfile(user.userId, defaultArtistProfile) as any;
    }

    return this.authService.createArtistMember(artist.id, memberData);
  }

  @Put('artist/members/:memberId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Mettre à jour un membre',
    description: 'Met à jour les informations d\'un membre du groupe'
  })
  @ApiBody({ type: UpdateArtistMemberDto })
  @ApiOkResponse({ description: 'Membre mis à jour avec succès' })
  @ApiBadRequestResponse({ description: 'Membre non trouvé ou données invalides' })
  async updateArtistMember(
    @GetUser() user: AuthenticatedUser, 
    @Param('memberId') memberId: string,
    @Body() updateData: UpdateArtistMemberDto
  ) {
    // Récupérer l'artiste lié à l'utilisateur
    const artist = await this.authService.getArtistProfile(user.userId);
    if (!artist) {
      throw new BadRequestException('Profil artiste non trouvé');
    }
    
    return this.authService.updateArtistMember(artist.id, memberId, updateData);
  }

  @Get('artist/members/:memberId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Récupérer un membre spécifique',
    description: 'Récupère les informations détaillées d\'un membre du groupe'
  })
  @ApiOkResponse({ description: 'Membre récupéré avec succès' })
  @ApiBadRequestResponse({ description: 'Membre non trouvé' })
  async getArtistMember(@GetUser() user: AuthenticatedUser, @Param('memberId') memberId: string) {
    // Récupérer l'artiste lié à l'utilisateur
    const artist = await this.authService.getArtistProfile(user.userId);
    if (!artist) {
      throw new BadRequestException('Profil artiste non trouvé');
    }
    
    return this.authService.getArtistMember(artist.id, memberId);
  }

  @Delete('artist/members/:memberId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Supprimer un membre',
    description: 'Désactive un membre du groupe (soft delete)'
  })
  @ApiOkResponse({ 
    description: 'Membre supprimé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Membre supprimé avec succès' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Membre non trouvé' })
  async deleteArtistMember(@GetUser() user: AuthenticatedUser, @Param('memberId') memberId: string) {
    // Récupérer l'artiste lié à l'utilisateur
    const artist = await this.authService.getArtistProfile(user.userId);
    if (!artist) {
      throw new BadRequestException('Profil artiste non trouvé');
    }
    
    return this.authService.deleteArtistMember(artist.id, memberId);
  }
}

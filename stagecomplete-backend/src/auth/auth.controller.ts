import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  VerifyTokenResponseDto,
  UpdateProfileDto,
  UpdateUserDto,
  ChangePasswordDto,
  DeleteAccountDto,
  DeleteAccountResponseDto,
} from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from './decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    // private profileService: ProfileService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: "Inscription d'un nouvel utilisateur",
    description:
      'Crée un nouveau compte utilisateur avec les informations fournies',
  })
  @ApiBody({
    type: RegisterDto,
    description: "Données d'inscription",
    examples: {
      artist: {
        summary: 'Inscription artiste',
        description: "Exemple d'inscription pour un artiste",
        value: {
          email: 'artiste@example.com',
          password: 'MonMotDePasse123!',
          name: 'Jean Dupont',
          role: 'ARTIST',
        },
      },
      venue: {
        summary: 'Inscription lieu',
        description: "Exemple d'inscription pour un lieu de spectacle",
        value: {
          email: 'venue@example.com',
          password: 'MonMotDePasse123!',
          name: 'Salle de Concert Olympia',
          role: 'VENUE',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Inscription réussie',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Données d'inscription invalides",
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
                example: ['Email invalide'],
              },
            },
          },
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    console.log('registerDto', registerDto);
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur et retourne un token JWT',
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
          password: 'MonMotDePasse123!',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Connexion réussie',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Identifiants incorrects',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Email ou mot de passe incorrect' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
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
                example: ['Email requis'],
              },
            },
          },
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    console.log('loginDto', loginDto);
    return await this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Récupérer le profil de l'utilisateur connecté",
    description:
      "Retourne les informations complètes du profil de l'utilisateur authentifié",
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
            role: {
              type: 'string',
              enum: ['ARTIST', 'VENUE'],
              example: 'ARTIST',
            },
            profile: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clm987654321' },
                name: { type: 'string', example: 'Jean Dupont' },
                bio: { type: 'string', example: 'Musicien professionnel...' },
                avatar: {
                  type: 'string',
                  example: 'https://example.com/avatar.jpg',
                },
                location: { type: 'string', example: 'Paris, France' },
                phone: { type: 'string', example: '+33123456789' },
                website: { type: 'string', example: 'https://monsite.com' },
                socialLinks: {
                  type: 'object',
                  example: { instagram: 'https://instagram.com/user' },
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT manquant ou invalide',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async getProfile(@GetUser() user: AuthenticatedUser) {
    try {
      // Utilisation directe d'AuthService pour éviter les erreurs TypeScript
      const userProfile = await this.authService.findUserById(user.userId);
      return {
        message: 'Profil récupéré avec succès',
        user: userProfile,
      };
    } catch {
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
    description:
      "Met à jour les informations du profil de l'utilisateur authentifié",
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
          bio: "Musicien professionnel spécialisé dans le jazz moderne avec 15 ans d'expérience...",
          location: 'Paris, France',
          phone: '+33123456789',
          website: 'https://jeandupont-music.com',
          socialLinks: {
            instagram: 'https://instagram.com/jeandupont_music',
            facebook: 'https://facebook.com/jeandupont.music',
            youtube: 'https://youtube.com/c/jeandupont',
          },
        },
      },
      example2: {
        summary: 'Mise à jour partielle',
        description: 'Exemple de mise à jour de quelques champs seulement',
        value: {
          bio: 'Nouvelle biographie mise à jour',
          location: 'Lyon, France',
        },
      },
    },
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
            role: {
              type: 'string',
              enum: ['ARTIST', 'VENUE'],
              example: 'ARTIST',
            },
            profile: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clm987654321' },
                name: { type: 'string', example: 'Jean Dupont' },
                bio: { type: 'string', example: 'Musicien professionnel...' },
                avatar: {
                  type: 'string',
                  example: 'https://example.com/avatar.jpg',
                },
                location: { type: 'string', example: 'Paris, France' },
                phone: { type: 'string', example: '+33123456789' },
                website: { type: 'string', example: 'https://monsite.com' },
                socialLinks: {
                  type: 'object',
                  example: { instagram: 'https://instagram.com/user' },
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Données de validation invalides',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Erreur lors de la mise à jour du profil',
        },
        error: {
          type: 'object',
          example: {
            field: 'phone',
            errors: [
              'Le numéro de téléphone doit contenir au moins 10 chiffres',
            ],
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT manquant ou invalide',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async updateProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    console.log('updateProfileDto', updateProfileDto);
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
    summary: "Vérifier la validité d'un token JWT",
    description: 'Vérifie si un token JWT est valide et non expiré',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'Token JWT à vérifier',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['token'],
    },
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
            role: 'ARTIST',
          },
        },
        message: { type: 'string', example: 'Token valide' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token invalide ou expiré',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Token invalide ou expiré' },
      },
    },
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
    } catch {
      return {
        valid: false,
        message: 'Token invalide ou expiré',
      };
    }
  }

  @Post('check-email')
  @ApiOperation({
    summary: "Vérifier la disponibilité d'un email",
    description:
      'Vérifie si une adresse email est déjà utilisée sur la plateforme',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Adresse email à vérifier',
          example: 'user@example.com',
        },
      },
      required: ['email'],
    },
  })
  @ApiOkResponse({
    description: "Résultat de la vérification de l'email",
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Email disponible' },
      },
    },
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
    description:
      'Endpoint de test pour valider le format des données de connexion sans authentification',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Données de connexion à tester',
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
            password: { type: 'string', example: 'MonMotDePasse123!' },
          },
        },
      },
    },
  })
  testLogin(@Body() loginDto: LoginDto) {
    return {
      message: 'Validation réussie !',
      data: loginDto,
    };
  }

  // ==========  ENDPOINTS USER MANAGEMENT ==========

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Récupérer les informations personnelles de l'utilisateur",
    description:
      "Retourne les données personnelles (prénom, nom, email, etc.) de l'utilisateur connecté",
  })
  @ApiOkResponse({
    description: 'Informations utilisateur récupérées avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clm123456789' },
        email: { type: 'string', example: 'jean.dupont@example.com' },
        firstName: { type: 'string', example: 'Jean' },
        lastName: { type: 'string', example: 'Dupont' },
        phone: { type: 'string', example: '+33 6 12 34 56 78' },
        isFounder: { type: 'boolean', example: true },
        role: {
          type: 'string',
          enum: ['ARTIST', 'VENUE', 'MEMBER', 'ADMIN'],
          example: 'ARTIST',
        },
        createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        profile: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clm987654321' },
            displayName: { type: 'string', example: 'Jean Dupont Music' },
            avatar: { type: 'string', example: 'data:image/jpeg;base64,...' },
            createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token manquant ou invalide',
  })
  async getUserInfo(@GetUser() user: AuthenticatedUser) {
    return await this.authService.getUserInfo(user.userId);
  }

  @Put('user')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Mettre à jour les informations personnelles de l'utilisateur",
    description:
      "Permet de modifier les données personnelles de l'utilisateur connecté",
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Informations utilisateur mises à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        isFounder: { type: 'boolean' },
        role: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        profile: { type: 'object' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Données de mise à jour invalides',
  })
  @ApiUnauthorizedResponse({
    description: 'Token manquant ou invalide',
  })
  async updateUser(
    @GetUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.authService.updateUser(user.userId, updateUserDto);
  }

  @Put('user/password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Changer le mot de passe de l'utilisateur",
    description:
      "Permet à l'utilisateur de changer son mot de passe en fournissant l'ancien et le nouveau",
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    description: 'Mot de passe modifié avec succès',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Mot de passe modifié avec succès',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "Données invalides ou nouveau mot de passe identique à l'ancien",
  })
  @ApiUnauthorizedResponse({
    description: 'Token manquant ou invalide, ou mot de passe actuel incorrect',
  })
  async changePassword(
    @GetUser() user: AuthenticatedUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      user.userId,
      changePasswordDto,
    );
  }

  @Delete('user')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer le compte utilisateur',
    description:
      'Supprime définitivement le compte utilisateur et toutes ses données associées. Cette action est irréversible.',
  })
  @ApiBody({
    type: DeleteAccountDto,
    description: 'Mot de passe actuel requis pour confirmer la suppression',
  })
  @ApiOkResponse({
    description: 'Compte supprimé avec succès',
    type: DeleteAccountResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Données invalides',
  })
  @ApiUnauthorizedResponse({
    description: 'Token manquant ou invalide, ou mot de passe incorrect',
  })
  async deleteAccount(
    @GetUser() user: AuthenticatedUser,
    @Body() deleteAccountDto: DeleteAccountDto,
  ): Promise<DeleteAccountResponseDto> {
    return await this.authService.deleteAccount(user.userId, deleteAccountDto);
  }
}

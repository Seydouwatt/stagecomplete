import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  VerifyTokenResponseDto,
} from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() user: AuthenticatedUser) {
    return {
      message: 'Profil récupéré avec succès',
      user: user,
    };
  }

  @Post('verify-token')
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

  // Endpoint utilitaire pour vérifier si un email existe
  @Post('check-email')
  async checkEmail(@Body('email') email: string) {
    const exists = await this.authService.emailExists(email);
    return {
      exists,
      message: exists ? 'Email déjà utilisé' : 'Email disponible',
    };
  }

  @Post('test-login')
  testLogin(@Body() loginDto: LoginDto) {
    return {
      message: 'Validation réussie !',
      data: loginDto,
    };
  }
}

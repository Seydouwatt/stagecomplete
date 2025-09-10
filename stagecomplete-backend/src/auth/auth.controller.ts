import { Body, Controller, Post } from '@nestjs/common';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
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

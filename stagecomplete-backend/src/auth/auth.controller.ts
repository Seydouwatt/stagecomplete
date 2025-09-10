import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  @Post('test-register')
  testRegister(@Body() registerDto: RegisterDto) {
    return {
      message: 'Validation réussie !',
      data: registerDto,
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

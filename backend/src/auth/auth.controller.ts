import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RegistroDto } from './dto/registro.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  registrar(@Body() registroDto: RegistroDto) {
    return this.authService.registrar(registroDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  perfil(
    @Req()
    req: {
      user: {
        id: number;
        email: string;
        tipo: 'ORGANIZADOR' | 'RECEPCIONISTA' | 'PARTICIPANTE';
      };
    },
  ) {
    return req.user;
  }
}
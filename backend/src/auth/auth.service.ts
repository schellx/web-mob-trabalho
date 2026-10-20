import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { compararSenha } from './senha.util.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.senha) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!usuario || !(await compararSenha(loginDto.senha, usuario.senhaHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const access_token = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    return {
      access_token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    };
  }
}
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { compararSenha, criarHashSenha } from './senha.util.js';
import { LoginDto } from './dto/login.dto.js';
import { RegistroDto } from './dto/registro.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(registroDto: RegistroDto) {
    const nome = registroDto.nome.trim();
    const email = registroDto.email.trim().toLowerCase();

    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'Já existe uma conta com esse e-mail.',
      );
    }

    const senhaHash = await criarHashSenha(registroDto.senha);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        tipo: 'ORGANIZADOR',
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
      },
    });

    return {
      mensagem: 'Conta criada com sucesso.',
      usuario,
    };
  }

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
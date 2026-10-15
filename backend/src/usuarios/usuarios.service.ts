import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsuariosService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data: {
        nome: createUsuarioDto.nome,
        email: createUsuarioDto.email,
        tipo: createUsuarioDto.tipo,
      },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto.js';
import { UpdateEventoDto } from './dto/update-evento.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EventosService {

  constructor(private readonly prisma:PrismaService){

  }

  async create(createEventoDto: CreateEventoDto) {
    return this.prisma.evento.create({
      data: {
        nome: createEventoDto.nome,
        descricao: createEventoDto.descricao,
        local: createEventoDto.local,
        data: new Date(createEventoDto.data),
        organizadorId: createEventoDto.organizadorId,
      },
    });
  }

  findAll() {
    return this.prisma.evento.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} evento`;
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return `This action updates a #${id} evento`;
  }

  remove(id: number) {
    return `This action removes a #${id} evento`;
  }
}
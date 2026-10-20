import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.evento.findMany({
      orderBy: {
        data: 'asc',
      },  
    });
  }

  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where:{id},
    });

    if (!evento){
       throw new NotFoundException('Evento não encontrado.');
    }

    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    await this.findOne(id);

    const { data, ...outrosCampos } = updateEventoDto;

    return this.prisma.evento.update({
      where: { id },
      data: {
        ...outrosCampos,
        ...(data !== undefined ? { data: new Date(data) } : {}),
      },
    });
  }

  remove(id: number) {
    const evento = this.prisma.evento.findUnique({
      where: {id},

      include: {
        lotes: true,
        inscricoes: true,
      },
      
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (evento.lotes.length > 0 || evento.inscricoes.length > 0){
      throw new ConflictException('Não é possível excluir evento com lotes ou inscrições!')
    }

    return this.prisma.evento.delete({
      where: {id},
    });

  }
}
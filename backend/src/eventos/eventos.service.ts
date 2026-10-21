import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto.js';
import { UpdateEventoDto } from './dto/update-evento.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EventosService {

  constructor(private readonly prisma:PrismaService){

  }

async create(
  createEventoDto: CreateEventoDto,
  organizadorId: number,
) {
  return this.prisma.evento.create({
    data: {
      nome: createEventoDto.nome,
      descricao: createEventoDto.descricao,
      local: createEventoDto.local,
      data: new Date(createEventoDto.data),
      organizadorId,
    },
  });
}

  findAll(organizadorId?: number) {
  return this.prisma.evento.findMany({
    where:
      organizadorId !== undefined
        ? { organizadorId }
        : undefined,
    orderBy: {
      data: 'asc',
    },
  });
}

 async findOne(id: number, organizadorId?: number) {
  const evento = await this.prisma.evento.findUnique({
    where: { id },
  });

  if (
    !evento ||
    (organizadorId !== undefined &&
      evento.organizadorId !== organizadorId)
  ) {
    throw new NotFoundException('Evento não encontrado.');
  }

  return evento;
}

 async update(
  id: number,
  updateEventoDto: UpdateEventoDto,
  organizadorId: number,
) {
  const evento = await this.prisma.evento.findUnique({
    where: { id },
  });

  if (!evento || evento.organizadorId !== organizadorId) {
    throw new NotFoundException('Evento não encontrado.');
  }

  const { data, ...outrosCampos } = updateEventoDto;

  return this.prisma.evento.update({
    where: { id },
    data: {
      ...outrosCampos,
      ...(data !== undefined ? { data: new Date(data) } : {}),
    },
  });
}

async remove(id: number, organizadorId: number) {
  const evento = await this.prisma.evento.findUnique({
    where: { id },
    include: {
      lotes: true,
      inscricoes: true,
    },
  });

  if (!evento || evento.organizadorId !== organizadorId) {
    throw new NotFoundException('Evento não encontrado.');
  }

  if (evento.lotes.length > 0 || evento.inscricoes.length > 0) {
    throw new ConflictException(
      'Não é possível excluir um evento com lotes ou inscrições.',
    );
  }

  await this.prisma.evento.delete({
    where: { id },
  });
}
}
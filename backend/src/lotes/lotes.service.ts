import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLoteDto } from './dto/create-lote.dto.js';
import { UpdateLoteDto } from './dto/update-lote.dto.js';

@Injectable()
export class LotesService {
  constructor(private readonly prisma: PrismaService) {}

  private async verificarEvento(eventoId: number, organizadorId: number) {
    const evento = await this.prisma.evento.findFirst({
      where: {
        id: eventoId,
        organizadorId,
      },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    return evento;
  }

  async create(
    eventoId: number,
    dto: CreateLoteDto,
    organizadorId: number,
  ) {
    const inicio = new Date(dto.inicio);
    const fim = new Date(dto.fim);

    if (inicio >= fim) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de término.',
      );
    }

    await this.verificarEvento(eventoId, organizadorId);

    return this.prisma.lote.create({
      data: {
        nome: dto.nome,
        quantidade: dto.quantidade,
        inicio,
        fim,
        eventoId,
      },
    });
  }

  async findAll(eventoId: number, organizadorId: number) {
    await this.verificarEvento(eventoId, organizadorId);

    return this.prisma.lote.findMany({
      where: {
        eventoId,
      },
      orderBy: {
        inicio: 'asc',
      },
    });
  }

  async update(
    id: number,
    dto: UpdateLoteDto,
    organizadorId: number,
  ) {
    const lote = await this.prisma.lote.findUnique({
      where: { id },
      include: {
        evento: {
          select: {
            organizadorId: true,
          },
        },
      },
    });

    if (!lote || lote.evento.organizadorId !== organizadorId) {
      throw new NotFoundException('Lote não encontrado.');
    }

    const inicio = dto.inicio
      ? new Date(dto.inicio)
      : lote.inicio;

    const fim = dto.fim
      ? new Date(dto.fim)
      : lote.fim;

    if (inicio >= fim) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de término.',
      );
    }

    if (dto.quantidade !== undefined) {
      const inscricoesAtivas = await this.prisma.inscricao.count({
        where: {
          loteId: id,
          status: 'ATIVA',
        },
      });

      if (dto.quantidade < inscricoesAtivas) {
        throw new ConflictException(
          'A quantidade de vagas não pode ser menor que o número de inscrições ativas.',
        );
      }
    }

    return this.prisma.lote.update({
      where: { id },
      data: {
        ...(dto.nome !== undefined ? { nome: dto.nome } : {}),
        ...(dto.quantidade !== undefined
          ? { quantidade: dto.quantidade }
          : {}),
        ...(dto.inicio !== undefined ? { inicio } : {}),
        ...(dto.fim !== undefined ? { fim } : {}),
      },
    });
  }
}
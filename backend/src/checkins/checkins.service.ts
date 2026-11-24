import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

type TipoUsuario =
  | 'ORGANIZADOR'
  | 'RECEPCIONISTA'
  | 'PARTICIPANTE';

@Injectable()
export class CheckinsService {
  constructor(private readonly prisma: PrismaService) {}

  // Registra a entrada de um participante.
  async registrar(inscricaoId: number, recepcionistaId: number) {
    const inscricao = await this.prisma.inscricao.findUnique({
      where: {
        id: inscricaoId,
      },
      select: {
        id: true,
        codigo: true,
        status: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException('Inscrição não encontrada.');
    }

    // Somente inscrições ativas podem realizar check-in.
    if (inscricao.status !== 'ATIVA') {
      throw new ConflictException(
        'Esta inscrição não está ativa e não pode realizar check-in.',
      );
    }

    // Cria o check-in sem duplicar um registro existente.
    const resultado = await this.prisma.checkIn.createMany({
      data: [
        {
          inscricaoId,
          recepcionistaId,
        },
      ],
      skipDuplicates: true,
    });

    // Busca o registro existente ou recém-criado.
    const checkIn = await this.prisma.checkIn.findUnique({
      where: {
        inscricaoId,
      },
      select: {
        realizadoEm: true,
      },
    });

    if (!checkIn) {
      throw new InternalServerErrorException(
        'Não foi possível confirmar o check-in.',
      );
    }

    return {
      inscricaoId: inscricao.id,
      codigo: inscricao.codigo,
      realizadoEm: checkIn.realizadoEm,
      jaRealizado: resultado.count === 0,
    };
  }

  // Consulta inscrições, presentes e lista de espera de um evento.
  async contar(
    eventoId: number,
    usuarioId: number,
    tipoUsuario: TipoUsuario,
  ) {
    const evento = await this.prisma.evento.findUnique({
      where: {
        id: eventoId,
      },
      select: {
        id: true,
        organizadorId: true,
      },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    // O organizador só consulta os próprios eventos.
    if (
      tipoUsuario === 'ORGANIZADOR' &&
      evento.organizadorId !== usuarioId
    ) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const [
      totalInscricoes,
      totalInscritos,
      totalPresentes,
      totalNaoPresentes,
      totalListaEspera,
    ] = await Promise.all([
      // Todas as inscrições.
      this.prisma.inscricao.count({
        where: {
          eventoId,
        },
      }),

      // Somente inscrições ativas.
      this.prisma.inscricao.count({
        where: {
          eventoId,
          status: 'ATIVA',
        },
      }),

      // Inscrições ativas com check-in realizado.
      this.prisma.inscricao.count({
        where: {
          eventoId,
          status: 'ATIVA',
          checkIn: {
            isNot: null,
          },
        },
      }),

      // Inscrições ativas sem check-in.
      this.prisma.inscricao.count({
        where: {
          eventoId,
          status: 'ATIVA',
          checkIn: {
            is: null,
          },
        },
      }),

      // Inscrições que estão na lista de espera.
      this.prisma.inscricao.count({
        where: {
          eventoId,
          status: 'LISTA_ESPERA',
        },
      }),
    ]);

    return {
      eventoId,
      totalInscricoes,
      totalInscritos,
      totalPresentes,
      totalNaoPresentes,
      totalListaEspera,
    };
  }
}
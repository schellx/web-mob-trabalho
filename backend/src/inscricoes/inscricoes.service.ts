import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomBytes } from 'node:crypto';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInscricaoDto } from './dto/create-inscricao.dto.js';

@Injectable()
export class InscricoesService {
  constructor(private readonly prisma: PrismaService) {}

  private gerarCodigo(): string {
    return `EVT-${randomBytes(6).toString('hex').toUpperCase()}`;
  }

  private ehErroDeConcorrencia(erro: unknown): boolean {
    return (
      typeof erro === 'object' &&
      erro !== null &&
      'code' in erro &&
      erro.code === 'P2034'
    );
  }

  // Cadastra uma inscrição e verifica a disponibilidade de vagas.
  async create(dto: CreateInscricaoDto, organizadorId: number) {
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            // Verifica se o evento pertence ao organizador.
            const evento = await tx.evento.findFirst({
              where: {
                id: dto.eventoId,
                organizadorId,
              },
            });

            if (!evento) {
              throw new NotFoundException('Evento não encontrado.');
            }

            // Verifica se o lote pertence ao evento.
            const lote = await tx.lote.findFirst({
              where: {
                id: dto.loteId,
                eventoId: dto.eventoId,
              },
            });

            if (!lote) {
              throw new BadRequestException(
                'O lote informado não pertence a este evento.',
              );
            }

            // Verifica o período de validade do lote.
            const agora = new Date();

            if (agora < lote.inicio) {
              throw new BadRequestException(
                'O período de inscrições deste lote ainda não começou.',
              );
            }

            if (agora > lote.fim) {
              throw new BadRequestException(
                'O período de inscrições deste lote já terminou.',
              );
            }

            // Verifica se o participante existe e possui o perfil correto.
            const participante = await tx.usuario.findFirst({
              where: {
                id: dto.participanteId,
                tipo: 'PARTICIPANTE',
              },
            });

            if (!participante) {
              throw new NotFoundException(
                'Participante não encontrado.',
              );
            }

            // Conta somente as inscrições ativas.
            const inscricoesAtivas = await tx.inscricao.count({
              where: {
                loteId: lote.id,
                status: 'ATIVA',
              },
            });

            // Define o status conforme a disponibilidade de vagas.
            const status =
              inscricoesAtivas < lote.quantidade
                ? 'ATIVA'
                : 'LISTA_ESPERA';

            // Cria a inscrição com código gerado pelo servidor.
            return tx.inscricao.create({
              data: {
                codigo: this.gerarCodigo(),
                status,
                participanteId: participante.id,
                eventoId: evento.id,
                loteId: lote.id,
              },
              include: {
                participante: {
                  select: {
                    id: true,
                    nome: true,
                    email: true,
                  },
                },
                lote: {
                  select: {
                    id: true,
                    nome: true,
                    quantidade: true,
                  },
                },
              },
            });
          },
          {
            isolationLevel: 'Serializable',
          },
        );
      } catch (erro) {
        if (!this.ehErroDeConcorrencia(erro)) {
          throw erro;
        }

        if (tentativa === 3) {
          throw new ConflictException(
            'Não foi possível concluir a inscrição devido à concorrência de vagas. Tente novamente.',
          );
        }
      }
    }

    throw new ConflictException(
      'Não foi possível concluir a inscrição.',
    );
  }

  // Lista inscrições de um evento e permite buscar por nome ou código.
  async findAll(
    eventoId: number,
    usuarioId: number,
    tipoUsuario: 'ORGANIZADOR' | 'RECEPCIONISTA' | 'PARTICIPANTE',
    busca?: string,
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

    // O organizador só consulta inscrições dos próprios eventos.
    if (
      tipoUsuario === 'ORGANIZADOR' &&
      evento.organizadorId !== usuarioId
    ) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const termo = busca?.trim();

    return this.prisma.inscricao.findMany({
      where: {
        eventoId,

        ...(termo
          ? {
              OR: [
                {
                  codigo: {
                    contains: termo,
                    mode: 'insensitive',
                  },
                },
                {
                  participante: {
                    is: {
                      nome: {
                        contains: termo,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },

      include: {
        participante: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        lote: {
          select: {
            id: true,
            nome: true,
            quantidade: true,
          },
        },
        checkIn: {
          select: {
            id: true,
            realizadoEm: true,
          },
        },
      },

      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  // Consulta uma inscrição pertencente a um evento do organizador.
  async findOne(id: number, organizadorId: number) {
    const inscricao = await this.prisma.inscricao.findFirst({
      where: {
        id,
        evento: {
          is: {
            organizadorId,
          },
        },
      },
      include: {
        participante: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        evento: {
          select: {
            id: true,
            nome: true,
          },
        },
        lote: {
          select: {
            id: true,
            nome: true,
            quantidade: true,
          },
        },
        checkIn: true,
      },
    });

    if (!inscricao) {
      throw new NotFoundException('Inscrição não encontrada.');
    }

    return inscricao;
  }

  // O participante só consulta as próprias inscrições.
  async findMinhas(participanteId: number) {
    return this.prisma.inscricao.findMany({
      where: {
        participanteId,
      },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            local: true,
            data: true,
          },
        },
        lote: {
          select: {
            id: true,
            nome: true,
            inicio: true,
            fim: true,
          },
        },
        checkIn: {
          select: {
            realizadoEm: true,
          },
        },
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }
}
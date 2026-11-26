
import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InscricoesService } from './inscricoes.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('InscricoesService', () => {
  let service: InscricoesService;

  const prismaMock = {
    evento: {
      findUnique: vi.fn(),
    },
    inscricao: {
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new InscricoesService(
      prismaMock as unknown as PrismaService,
    );
  });

  it('deve buscar as inscrições do participante', async () => {
    const inscricoes = [
      {
        id: 2,
        codigo: 'EVT-974B1F03C340',
        status: 'ATIVA',
      },
    ];

    prismaMock.inscricao.findMany.mockResolvedValue(inscricoes);

    const resultado = await service.findMinhas(4);

    expect(resultado).toEqual(inscricoes);

    expect(prismaMock.inscricao.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          participanteId: 4,
        },
      }),
    );
  });

  it('deve pesquisar inscrições por nome ou código', async () => {
    const evento = {
      id: 40,
      organizadorId: 5,
    };

    const inscricoes = [
      {
        id: 2,
        codigo: 'EVT-974B1F03C340',
        status: 'ATIVA',
      },
    ];

    prismaMock.evento.findUnique.mockResolvedValue(evento);
    prismaMock.inscricao.findMany.mockResolvedValue(inscricoes);

    const resultado = await service.findAll(
      40,
      9,
      'RECEPCIONISTA',
      'Adalberto',
    );

    expect(resultado).toEqual(inscricoes);

    expect(prismaMock.inscricao.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          eventoId: 40,
          OR: [
            {
              codigo: {
                contains: 'Adalberto',
                mode: 'insensitive',
              },
            },
            {
              participante: {
                is: {
                  nome: {
                    contains: 'Adalberto',
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        },
      }),
    );
  });

  it('deve rejeitar a busca de um evento inexistente', async () => {
    prismaMock.evento.findUnique.mockResolvedValue(null);

    await expect(
      service.findAll(999, 9, 'RECEPCIONISTA'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(
      prismaMock.inscricao.findMany,
    ).not.toHaveBeenCalled();
  });
});

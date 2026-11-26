
import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckinsService } from './checkins.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('CheckinsService', () => {
  let service: CheckinsService;

  const prismaMock = {
    inscricao: {
      findUnique: vi.fn(),
    },
    checkIn: {
      createMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new CheckinsService(
      prismaMock as unknown as PrismaService,
    );
  });

  it('deve registrar o check-in de uma inscrição ativa', async () => {
    const realizadoEm = new Date('2026-11-25T20:00:00Z');

    prismaMock.inscricao.findUnique.mockResolvedValue({
      id: 2,
      codigo: 'EVT-974B1F03C340',
      status: 'ATIVA',
    });

    prismaMock.checkIn.createMany.mockResolvedValue({
      count: 1,
    });

    prismaMock.checkIn.findUnique.mockResolvedValue({
      realizadoEm,
    });

    const resultado = await service.registrar(2, 9);

    expect(resultado.jaRealizado).toBe(false);
    expect(resultado.inscricaoId).toBe(2);
    expect(resultado.codigo).toBe('EVT-974B1F03C340');
    expect(resultado.realizadoEm).toEqual(realizadoEm);
  });

  it('não deve duplicar um check-in já realizado', async () => {
    const realizadoEm = new Date('2026-11-25T20:00:00Z');

    prismaMock.inscricao.findUnique.mockResolvedValue({
      id: 2,
      codigo: 'EVT-974B1F03C340',
      status: 'ATIVA',
    });

    prismaMock.checkIn.createMany.mockResolvedValue({
      count: 0,
    });

    prismaMock.checkIn.findUnique.mockResolvedValue({
      realizadoEm,
    });

    const resultado = await service.registrar(2, 9);

    expect(resultado.jaRealizado).toBe(true);
    expect(resultado.inscricaoId).toBe(2);
    expect(resultado.realizadoEm).toEqual(realizadoEm);
  });

  it('deve rejeitar uma inscrição inexistente', async () => {
    prismaMock.inscricao.findUnique.mockResolvedValue(null);

    await expect(
      service.registrar(999, 9),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(
      prismaMock.checkIn.createMany,
    ).not.toHaveBeenCalled();
  });
});

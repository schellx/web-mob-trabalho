import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CheckinsService } from './checkins.service.js';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

interface RequisicaoAutenticada {
  user: {
    id: number;
    email: string;
    tipo: 'ORGANIZADOR' | 'RECEPCIONISTA' | 'PARTICIPANTE';
  };
}

@Controller()
export class CheckinsController {
  constructor(
    private readonly checkinsService: CheckinsService,
  ) {}
  // Verifica se a demonstração mobile está habilitada.
  private verificarDemo() {
    if (
      process.env.MOBILE_DEMO !== 'true' ||
      process.env.NODE_ENV === 'production'
    ) {
      throw new ForbiddenException(
        'A demonstração do mobile não está habilitada.',
      );
    }
  }

  // Registra check-in pelo aplicativo de demonstração.
  @Post('inscricoes/demo/:id/checkin')
  @HttpCode(HttpStatus.OK)
  registrarDemo(
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.verificarDemo();

    return this.checkinsService.registrar(id, 9);
  }

  // Consulta a contagem de presença pelo aplicativo.
  @Get('eventos/demo/:eventoId/contagem')
  contarDemo(
    @Param('eventoId', ParseIntPipe) eventoId: number,
  ) {
    this.verificarDemo();

    return this.checkinsService.contar(
      eventoId,
      9,
      'RECEPCIONISTA',
    );
  }

  // Registra o check-in de uma inscrição.
  @Post('inscricoes/:id/checkin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RECEPCIONISTA')
  @HttpCode(HttpStatus.OK)
  registrar(
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: RequisicaoAutenticada,
  ) {
    return this.checkinsService.registrar(
      id,
      requisicao.user.id,
    );
  }

  // Consulta a quantidade de inscritos e presentes.
  @Get('eventos/:eventoId/contagem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZADOR', 'RECEPCIONISTA')
  contar(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Req() requisicao: RequisicaoAutenticada,
  ) {
    return this.checkinsService.contar(
      eventoId,
      requisicao.user.id,
      requisicao.user.tipo,
    );
  }
}
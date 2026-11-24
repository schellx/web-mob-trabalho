import {
  Controller,
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
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LotesService } from './lotes.service.js';
import { CreateLoteDto } from './dto/create-lote.dto.js';
import { UpdateLoteDto } from './dto/update-lote.dto.js';

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
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZADOR')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post('eventos/:eventoId/lotes')
  create(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Req() requisicao: RequisicaoAutenticada,
    @Body() dto: CreateLoteDto,
  ) {
    return this.lotesService.create(
      eventoId,
      dto,
      requisicao.user.id,
    );
  }

  @Get('eventos/:eventoId/lotes')
  findAll(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Req() requisicao: RequisicaoAutenticada,
  ) {
    return this.lotesService.findAll(
      eventoId,
      requisicao.user.id,
    );
  }

  @Patch('lotes/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: RequisicaoAutenticada,
    @Body() dto: UpdateLoteDto,
  ) {
    return this.lotesService.update(
      id,
      dto,
      requisicao.user.id,
    );
  }
}
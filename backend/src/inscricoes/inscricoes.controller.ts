import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { InscricoesService } from './inscricoes.service.js';
import { CreateInscricaoDto } from './dto/create-inscricao.dto.js';

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

@Controller('inscricoes')
export class InscricoesController {
  constructor(
    private readonly inscricoesService: InscricoesService,
  ) {}

  // Participante consulta suas próprias inscrições.
  @Get('minhas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTICIPANTE')
  findMinhas(@Req() requisicao: RequisicaoAutenticada) {
    return this.inscricoesService.findMinhas(
      requisicao.user.id,
    );
  }

  // Organizador cadastra uma inscrição.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZADOR')
  create(
    @Body() dto: CreateInscricaoDto,
    @Req() requisicao: RequisicaoAutenticada,
  ) {
    return this.inscricoesService.create(
      dto,
      requisicao.user.id,
    );
  }

  // Organizador e recepcionista consultam inscrições.
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZADOR', 'RECEPCIONISTA')
  findAll(
    @Query('eventoId', ParseIntPipe) eventoId: number,
    @Query('busca') busca: string | undefined,
    @Req() requisicao: RequisicaoAutenticada,
  ) {
    return this.inscricoesService.findAll(
      eventoId,
      requisicao.user.id,
      requisicao.user.tipo,
      busca,
    );
  }

  // Organizador consulta uma inscrição específica.
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZADOR')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: RequisicaoAutenticada,
  ) {
    return this.inscricoesService.findOne(
      id,
      requisicao.user.id,
    );
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
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

  // Permite as rotas demonstrativas somente em desenvolvimento.
  private verificarDemo() {
    if (
      process.env.MOBILE_DEMO !== 'true' ||
      process.env.NODE_ENV !== 'development'
    ) {
      throw new ForbiddenException(
        'A demonstração do mobile não está habilitada.',
      );
    }
  }

  // Participante consulta suas próprias inscrições.
  @Get('minhas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTICIPANTE')
  findMinhas(@Req() requisicao: RequisicaoAutenticada) {
    return this.inscricoesService.findMinhas(
      requisicao.user.id,
    );
  }

  // Participante de demonstração consulta seus ingressos.
  @Get('demo/participante')
  findIngressosDemo() {
    this.verificarDemo();

    return this.inscricoesService.findMinhas(4);
  }

  // Recepcionista de demonstração consulta inscrições de um evento.
  @Get('demo/evento/:eventoId')
  findInscricoesDemo(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Query('busca') busca?: string,
  ) {
    this.verificarDemo();

    return this.inscricoesService.findAll(
      eventoId,
      9,
      'RECEPCIONISTA',
      busca,
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

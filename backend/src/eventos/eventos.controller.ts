import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EventosService } from './eventos.service.js';
import { CreateEventoDto } from './dto/create-evento.dto.js';
import { UpdateEventoDto } from './dto/update-evento.dto.js';
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

@Controller('eventos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @Roles('ORGANIZADOR')
  create(
    @Req() requisicao: RequisicaoAutenticada,
    @Body() createEventoDto: CreateEventoDto,
  ) {
    return this.eventosService.create(
      createEventoDto,
      requisicao.user.id,
    );
  }

  @Get()
findAll(@Req() requisicao: RequisicaoAutenticada) {
  const organizadorId =
    requisicao.user.tipo === 'ORGANIZADOR'
      ? requisicao.user.id
      : undefined;

  return this.eventosService.findAll(organizadorId);
}

@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
  @Req() requisicao: RequisicaoAutenticada,
) {
  const organizadorId =
    requisicao.user.tipo === 'ORGANIZADOR'
      ? requisicao.user.id
      : undefined;

  return this.eventosService.findOne(id, organizadorId);
}
  @Patch(':id')
  @Roles('ORGANIZADOR')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: RequisicaoAutenticada,
    @Body() updateEventoDto: UpdateEventoDto,
  ) {
    return this.eventosService.update(
      id,
      updateEventoDto,
      requisicao.user.id,
    );
  }

  @Delete(':id')
  @Roles('ORGANIZADOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() requisicao: RequisicaoAutenticada,
  ) {
    return this.eventosService.remove(
      id,
      requisicao.user.id,
    );
  }
}
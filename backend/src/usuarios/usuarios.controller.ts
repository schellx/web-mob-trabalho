import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { CreateParticipanteDto } from './dto/create-participante.dto.js';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CreateRecepcionistaDto } from './dto/create-recepcionista.dto.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('participantes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZADOR')
  createParticipante(@Body() dto: CreateParticipanteDto) {
    return this.usuariosService.createParticipante(dto);
  }

  @Get('participantes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZADOR')
  findParticipantes() {
    return this.usuariosService.findParticipantes();
  }

    @Post('recepcionistas')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZADOR')
    createRecepcionista(@Body() dto: CreateRecepcionistaDto) {
      return this.usuariosService.createRecepcionista(dto);
    }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
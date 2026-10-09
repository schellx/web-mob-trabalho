import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto.js';
import { UpdateEventoDto } from './dto/update-evento.dto.js';

@Injectable()
export class EventosService {

  private eventos = [
    {
      id: 1,
      nome: 'Arthur Petry | Stand Up',
      descricao: 'Stand Up para todos os públicos',
      local: 'Comedy Club Risos',
      data: '2026-11-10',
    },
    {
      id: 2,
      nome: 'Workshop de Tecnologia',
      descricao: 'Programação avançada com Java',
      local: 'Laboratório 2 | UPF',
      data: '2026-11-20',
    },
    {
      id: 3,
      nome: 'Aula do Pablo',
      descricao: 'Backyardigans',
      local: 'Porão sinistro',
      data: '2026-12-30',
    },
    {
      id: 4,
      nome: 'xispa xou',
      descricao: 'rock',
      local: 'quinto dos inferno',
      data: '1923-01-01',
    }
  ];

  create(createEventoDto: CreateEventoDto) {
    return 'This action adds a new evento';
  }

  findAll() {
    return this.eventos;
  }

  findOne(id: number) {
    return `This action returns a #${id} evento`;
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return `This action updates a #${id} evento`;
  }

  remove(id: number) {
    return `This action removes a #${id} evento`;
  }
}
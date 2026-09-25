import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service.js';
import { EventosController } from './eventos.controller.js';

@Module({
  controllers: [EventosController],
  providers: [EventosService],
})
export class EventosModule {}

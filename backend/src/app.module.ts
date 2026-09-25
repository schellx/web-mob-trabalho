import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { EventosModule } from './eventos/eventos.module.js';

@Module({
  imports: [PrismaModule, EventosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
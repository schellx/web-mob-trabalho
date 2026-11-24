import { Module } from '@nestjs/common';

import { InscricoesController } from './inscricoes.controller.js';
import { InscricoesService } from './inscricoes.service.js';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InscricoesController],
  providers: [InscricoesService],
})
export class InscricoesModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { EventosModule } from './eventos/eventos.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LotesModule } from './lotes/lotes.module.js';
import { InscricoesModule } from './inscricoes/inscricoes.module.js';
import { CheckinsModule } from './checkins/checkins.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EventosModule,
    UsuariosModule,
    AuthModule,
    LotesModule,
    InscricoesModule,
    CheckinsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
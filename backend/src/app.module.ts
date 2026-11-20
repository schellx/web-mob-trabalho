import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { EventosModule } from './eventos/eventos.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LotesController } from './lotes/lotes.controller.js';
import { LotesService } from './lotes/lotes.service.js';
import { LotesModule } from './lotes/lotes.module.js';

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
  ],
  controllers: [AppController, LotesController],
  providers: [AppService, LotesService],
})
export class AppModule {}
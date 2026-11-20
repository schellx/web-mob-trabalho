import { Module } from '@nestjs/common';
import { LotesController } from './lotes.controller.js';
import { LotesService } from './lotes.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LotesController],
  providers: [LotesService],
})
export class LotesModule {}
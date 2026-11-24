import { Module } from '@nestjs/common';

import { CheckinsController } from './checkins.controller.js';
import { CheckinsService } from './checkins.service.js';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CheckinsController],
  providers: [CheckinsService],
})
export class CheckinsModule {}
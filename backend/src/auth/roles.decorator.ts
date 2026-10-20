import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type TipoUsuario =
  | 'ORGANIZADOR'
  | 'RECEPCIONISTA'
  | 'PARTICIPANTE';

export const Roles = (...roles: TipoUsuario[]) =>
  SetMetadata(ROLES_KEY, roles);
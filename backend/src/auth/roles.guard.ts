import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, TipoUsuario } from './roles.decorator.js';

interface UsuarioAutenticado {
  tipo: TipoUsuario;
}

interface RequisicaoAutenticada {
  user?: UsuarioAutenticado;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<TipoUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesPermitidos) {
      return true;
    }

    const requisicao =
      context.switchToHttp().getRequest<RequisicaoAutenticada>();

    return (
      requisicao.user !== undefined &&
      rolesPermitidos.includes(requisicao.user.tipo)
    );
  }
}
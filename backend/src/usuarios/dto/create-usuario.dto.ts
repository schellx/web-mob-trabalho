export class CreateUsuarioDto {

    nome: string;
    email: string;
    tipo: 'ORGANIZADOR' | 'RECEPCIONISTA' | 'PARTICIPANTE';

}

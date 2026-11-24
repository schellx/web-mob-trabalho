'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Dados do participante
export type Participante = {
  id: number;
  nome: string;
  email: string;
};

// Dados para cadastrar participante
export type DadosParticipante = {
  nome: string;
  email: string;
  senha: string;
};

// Dados da inscrição
export type Inscricao = {
  id: number;
  codigo: string;
  status: 'ATIVA' | 'LISTA_ESPERA' | 'CANCELADA';
  criadoEm: string;
  participanteId: number;
  eventoId: number;
  loteId: number;

  participante: Participante;

  lote: {
    id: number;
    nome: string;
    quantidade: number;
  };

  checkIn: {
    id: number;
    realizadoEm: string;
  } | null;
};

// Endereço do backend
const API_URL =
  process.env.API_URL ?? 'http://localhost:3000';

// Resultado das requisições
type ResultadoApi =
  | { resposta: Response }
  | { erro: string };

// Faz requisições autenticadas ao backend
async function requisitarAutenticado(
  caminho: string,
  opcoes: RequestInit = {},
): Promise<ResultadoApi> {
  const armazenamento = await cookies();
  const token = armazenamento.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const cabecalhos = new Headers(opcoes.headers);

  cabecalhos.set('Authorization', `Bearer ${token}`);

  if (opcoes.body) {
    cabecalhos.set('Content-Type', 'application/json');
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: cabecalhos,
      cache: 'no-store',
    });
  } catch {
    return {
      erro: 'Não foi possível conectar ao backend.',
    };
  }

  // Se o token expirou ou é inválido, volta para o login.
  if (resposta.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  return { resposta };
}

// Obtém a mensagem de erro enviada pelo backend
async function obterErro(resposta: Response): Promise<string> {
  const dados = await resposta.json().catch(() => null);

  if (typeof dados?.message === 'string') {
    return dados.message;
  }

  if (Array.isArray(dados?.message)) {
    return dados.message.join(' ');
  }

  return 'Ocorreu um erro na operação.';
}

// Lista os participantes cadastrados
export async function listarParticipantes(): Promise<{
  participantes?: Participante[];
  erro?: string;
}> {
  const resultado = await requisitarAutenticado(
    '/usuarios/participantes',
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterErro(resultado.resposta),
    };
  }

  const participantes: Participante[] =
    await resultado.resposta.json();

  return { participantes };
}

// Cadastra um participante
export async function criarParticipante(
  eventoId: number,
  dados: DadosParticipante,
): Promise<{
  participante?: Participante;
  erro?: string;
}> {
  const resultado = await requisitarAutenticado(
    '/usuarios/participantes',
    {
      method: 'POST',
      body: JSON.stringify(dados),
    },
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterErro(resultado.resposta),
    };
  }

  const participante: Participante =
    await resultado.resposta.json();

  revalidatePath(`/eventos/${eventoId}/inscricoes`);

  return { participante };
}

// Lista as inscrições de um evento
export async function listarInscricoes(
  eventoId: number,
): Promise<{
  inscricoes?: Inscricao[];
  erro?: string;
}> {
  const resultado = await requisitarAutenticado(
    `/inscricoes?eventoId=${eventoId}`,
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterErro(resultado.resposta),
    };
  }

  const inscricoes: Inscricao[] =
    await resultado.resposta.json();

  return { inscricoes };
}

// Realiza uma inscrição
export async function criarInscricao(
  eventoId: number,
  participanteId: number,
  loteId: number,
): Promise<{
  inscricao?: Inscricao;
  erro?: string;
}> {
  const resultado = await requisitarAutenticado(
    '/inscricoes',
    {
      method: 'POST',
      body: JSON.stringify({
        eventoId,
        participanteId,
        loteId,
      }),
    },
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterErro(resultado.resposta),
    };
  }

  const inscricao: Inscricao =
    await resultado.resposta.json();

  revalidatePath(`/eventos/${eventoId}/inscricoes`);

  return { inscricao };
}
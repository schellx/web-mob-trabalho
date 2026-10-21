'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type Evento = {
  id: number;
  nome: string;
  descricao: string | null;
  local: string;
  data: string;
};

export type DadosEvento = {
  nome: string;
  descricao?: string;
  local: string;
  data: string;
};

type ResultadoEventos = {
  eventos?: Evento[];
  erro?: string;
};

type ResultadoAcao = {
  sucesso?: boolean;
  erro?: string;
};

const API_URL =
  process.env.API_URL ?? 'http://localhost:3000';

async function requisitarAutenticado(
  caminho: string,
  opcoes: RequestInit = {}
): Promise<{ resposta: Response } | { erro: string }> {
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
      erro:
        'Não foi possível conectar ao backend. Verifique se ele está em execução.',
    };
  }

  if (resposta.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  return { resposta };
}

async function obterMensagemErro(
  resposta: Response,
  mensagemPadrao: string
): Promise<string> {
  const dados = await resposta.json().catch(() => null);

  if (typeof dados?.message === 'string') {
    return dados.message;
  }

  if (
    Array.isArray(dados?.message) &&
    dados.message.every((item: unknown) => typeof item === 'string')
  ) {
    return dados.message.join(' ');
  }

  return mensagemPadrao;
}

export async function listarEventos(): Promise<ResultadoEventos> {
  const resultado = await requisitarAutenticado('/eventos');

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível carregar os eventos.'
      ),
    };
  }

  const eventos: Evento[] = await resultado.resposta.json();

  return { eventos };
}

export async function criarEvento(
  dados: DadosEvento
): Promise<ResultadoAcao> {
  const resultado = await requisitarAutenticado('/eventos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível cadastrar o evento.'
      ),
    };
  }

  revalidatePath('/');

  return { sucesso: true };
}

export async function atualizarEvento(
  id: number,
  dados: DadosEvento
): Promise<ResultadoAcao> {
  const resultado = await requisitarAutenticado(
    `/eventos/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(dados),
    }
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível atualizar o evento.'
      ),
    };
  }

  revalidatePath('/');
  revalidatePath(`/eventos/${id}/editar`);

  return { sucesso: true };
}

export async function excluirEvento(
  id: number
): Promise<ResultadoAcao> {
  const resultado = await requisitarAutenticado(
    `/eventos/${id}`,
    { method: 'DELETE' }
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível excluir o evento.'
      ),
    };
  }

  revalidatePath('/');

  return { sucesso: true };
}

export async function buscarEvento(
  id: number
): Promise<{ evento?: Evento; erro?: string }> {
  const resultado = await requisitarAutenticado(`/eventos/${id}`);

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível encontrar o evento.'
      ),
    };
  }

  const evento: Evento = await resultado.resposta.json();

  return { evento };
}
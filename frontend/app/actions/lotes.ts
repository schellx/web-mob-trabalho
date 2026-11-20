'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type Lote = {
  id: number;
  nome: string;
  quantidade: number;
  inicio: string;
  fim: string;
  eventoId: number;
};

export type DadosLote = {
  nome: string;
  quantidade: number;
  inicio: string;
  fim: string;
};

const API_URL =
  process.env.API_URL ?? 'http://localhost:3000';

type ResultadoRequisicao =
  | { resposta: Response }
  | { erro: string };

async function requisitarAutenticado(
  caminho: string,
  opcoes: RequestInit = {},
): Promise<ResultadoRequisicao> {
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

  if (resposta.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  return { resposta };
}

async function obterMensagemErro(
  resposta: Response,
  mensagemPadrao: string,
): Promise<string> {
  const dados = await resposta.json().catch(() => null);

  if (typeof dados?.message === 'string') {
    return dados.message;
  }

  if (
    Array.isArray(dados?.message) &&
    dados.message.every(
      (item: unknown) => typeof item === 'string',
    )
  ) {
    return dados.message.join(' ');
  }

  return mensagemPadrao;
}

export async function listarLotes(
  eventoId: number,
): Promise<{ lotes?: Lote[]; erro?: string }> {
  const resultado = await requisitarAutenticado(
    `/eventos/${eventoId}/lotes`,
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível carregar os lotes.',
      ),
    };
  }

  const lotes: Lote[] = await resultado.resposta.json();

  return { lotes };
}

export async function criarLote(
  eventoId: number,
  dados: DadosLote,
): Promise<{ lote?: Lote; erro?: string }> {
  const resultado = await requisitarAutenticado(
    `/eventos/${eventoId}/lotes`,
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
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível cadastrar o lote.',
      ),
    };
  }

  const lote: Lote = await resultado.resposta.json();

  revalidatePath(`/eventos/${eventoId}/lotes`);

  return { lote };
}

export async function atualizarLote(
  id: number,
  dados: Partial<DadosLote>,
): Promise<{ lote?: Lote; erro?: string }> {
  const resultado = await requisitarAutenticado(
    `/lotes/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(dados),
    },
  );

  if ('erro' in resultado) {
    return { erro: resultado.erro };
  }

  if (!resultado.resposta.ok) {
    return {
      erro: await obterMensagemErro(
        resultado.resposta,
        'Não foi possível atualizar o lote.',
      ),
    };
  }

  const lote: Lote = await resultado.resposta.json();

  revalidatePath(`/eventos/${lote.eventoId}/lotes`);

  return { lote };
}
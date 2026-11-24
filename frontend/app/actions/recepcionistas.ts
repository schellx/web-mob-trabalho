'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type DadosRecepcionista = {
  nome: string;
  email: string;
  senha: string;
};

export type Recepcionista = {
  id: number;
  nome: string;
  email: string;
  tipo: 'RECEPCIONISTA';
  criadoEm: string;
};

export async function cadastrarRecepcionista(
  dados: DadosRecepcionista,
): Promise<{
  recepcionista?: Recepcionista;
  erro?: string;
}> {
  const armazenamento = await cookies();
  const token = armazenamento.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let resposta: Response;

  try {
    resposta = await fetch(
      `${process.env.API_URL ?? 'http://localhost:3000'}/usuarios/recepcionistas`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: dados.nome.trim(),
          email: dados.email.trim().toLowerCase(),
          senha: dados.senha,
        }),
        cache: 'no-store',
      },
    );
  } catch {
    return {
      erro: 'Não foi possível conectar ao backend.',
    };
  }

  if (resposta.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);

    if (Array.isArray(erro?.message)) {
      return { erro: erro.message.join(' ') };
    }

    return {
      erro:
        erro?.message ??
        'Não foi possível cadastrar o recepcionista.',
    };
  }

  const recepcionista: Recepcionista =
    await resposta.json();

  revalidatePath('/recepcionistas');

  return { recepcionista };
}
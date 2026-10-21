'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type EstadoLogin = {
  erro?: string;
};

export async function loginAction(
  _estado: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = String(formData.get('email') ?? '').trim();
  const senha = String(formData.get('senha') ?? '');

  if (!email || !senha) {
    return { erro: 'Informe o e-mail e a senha.' };
  }

  let resposta: Response;

  try {
    resposta = await fetch(
      `${process.env.API_URL ?? 'http://localhost:3000'}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
        cache: 'no-store',
      }
    );
  } catch {
    return {
      erro: 'Não foi possível conectar ao servidor. Verifique se o backend está ligado.',
    };
  }

  const dados = await resposta.json().catch(() => null);

  if (
    !resposta.ok ||
    typeof dados?.access_token !== 'string'
  ) {
    return {
      erro:
        typeof dados?.message === 'string'
          ? dados.message
          : 'E-mail ou senha inválidos.',
    };
  }

  const armazenamento = await cookies();

  armazenamento.set('token', dados.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });

  redirect('/');
}

export async function logoutAction(): Promise<void> {
  const armazenamento = await cookies();

  armazenamento.delete('token');

  redirect('/login');
}
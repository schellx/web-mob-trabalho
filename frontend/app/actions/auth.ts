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

type EstadoCadastro = {
  erro?: string;
  sucesso?: string;
};

export async function cadastroAction(
  _estado: EstadoCadastro,
  formData: FormData
): Promise<EstadoCadastro> {
  const nome = String(formData.get('nome') ?? '').trim();
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const senha = String(formData.get('senha') ?? '');

  if (!nome || !email || !senha) {
    return {
      erro: 'Preencha todos os campos.',
    };
  }

  if (senha.length < 8 || senha.length > 128) {
    return {
      erro: 'A senha deve ter entre 8 e 128 caracteres.',
    };
  }

  let resposta: Response;

  try {
    resposta = await fetch(
      `${process.env.API_URL ?? 'http://localhost:3000'}/auth/registro`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
        cache: 'no-store',
      }
    );
  } catch {
    return {
      erro: 'Não foi possível conectar ao servidor. Verifique se o backend está ligado.',
    };
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const mensagem =
      typeof dados?.message === 'string'
        ? dados.message
        : Array.isArray(dados?.message)
          ? dados.message.join(' ')
          : 'Não foi possível criar a conta. Tente novamente.';

    return { erro: mensagem };
  }

  return {
    sucesso: 'Conta criada com sucesso! Agora você pode entrar pela página de login.',
  };
}

export async function logoutAction(): Promise<void> {
  const armazenamento = await cookies();

  armazenamento.delete('token');

  redirect('/login');
}
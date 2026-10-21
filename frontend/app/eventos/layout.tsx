import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function EventosLayout({
  children,
}: {
  children: ReactNode;
}) {
  const armazenamento = await cookies();
  const token = armazenamento.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let resposta: Response;

  try {
    resposta = await fetch(
      `${process.env.API_URL ?? 'http://localhost:3000'}/auth/perfil`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
  } catch {
    throw new Error(
      'Não foi possível validar a sessão. Verifique se o backend está ligado.'
    );
  }

  if (resposta.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível validar a sessão no servidor.'
    );
  }

  return children;
}
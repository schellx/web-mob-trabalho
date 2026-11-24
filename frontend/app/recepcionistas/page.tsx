import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import GerenciarRecepcionistas from './gerenciar-recepcionistas-client';

import styles from './page.module.css';

const API_URL =
  process.env.API_URL ?? 'http://localhost:3000';

export default async function PaginaRecepcionistas() {
  const armazenamento = await cookies();
  const token = armazenamento.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/auth/perfil`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
  } catch {
    return (
      <main className={styles.container}>
        <p>Não foi possível conectar ao servidor.</p>
      </main>
    );
  }

  if (resposta.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  if (!resposta.ok) {
    redirect('/');
  }

  const usuario = await resposta.json();

  if (usuario.tipo !== 'ORGANIZADOR') {
    redirect('/');
  }

  return (
    <main className={styles.container}>
      <div className={styles.conteudo}>
        <h1 className={styles.titulo}>
          Gerenciar recepcionistas
        </h1>

        <p className={styles.descricao}>
          Cadastre os recepcionistas responsáveis pelo
          credenciamento e check-in dos eventos.
        </p>

        <GerenciarRecepcionistas />
      </div>
    </main>
  );
}
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import styles from './page.module.css';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Relatorio = {
  eventoId: number;
  totalInscricoes: number;
  totalInscritos: number;
  totalPresentes: number;
  totalNaoPresentes: number;
  totalListaEspera: number;
};

const API_URL =
  process.env.API_URL ?? 'http://localhost:3000';

export default async function PaginaRelatorio({ params }: Props) {
  const { id } = await params;
  const eventoId = Number(id);

  if (!Number.isSafeInteger(eventoId) || eventoId <= 0) {
    notFound();
  }

  const armazenamento = await cookies();
  const token = armazenamento.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  // Verifica o usuário autenticado.
  let respostaPerfil: Response;

  try {
    respostaPerfil = await fetch(`${API_URL}/auth/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
  } catch {
    return (
      <main className={styles.container}>
        <p>Não foi possível conectar ao backend.</p>
      </main>
    );
  }

  if (respostaPerfil.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  if (!respostaPerfil.ok) {
    redirect('/');
  }

  const usuario = await respostaPerfil.json();

  if (usuario.tipo !== 'ORGANIZADOR') {
    redirect('/');
  }

  // Busca os dados do relatório.
  let respostaRelatorio: Response;

  try {
    respostaRelatorio = await fetch(
      `${API_URL}/eventos/${eventoId}/contagem`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      },
    );
  } catch {
    return (
      <main className={styles.container}>
        <p>Não foi possível carregar o relatório.</p>
      </main>
    );
  }

  if (respostaRelatorio.status === 401) {
    armazenamento.delete('token');
    redirect('/login');
  }

  if (
    respostaRelatorio.status === 403 ||
    respostaRelatorio.status === 404
  ) {
    notFound();
  }

  if (!respostaRelatorio.ok) {
    return (
      <main className={styles.container}>
        <p>Ocorreu um erro ao consultar o comparecimento.</p>
      </main>
    );
  }

  const relatorio: Relatorio =
    await respostaRelatorio.json();

  const percentual =
    relatorio.totalInscritos > 0
      ? (relatorio.totalPresentes / relatorio.totalInscritos) * 100
      : 0;

  return (
    <main className={styles.container}>
      <div className={styles.conteudo}>
        <Link
          href={`/eventos/${eventoId}`}
          className={styles.voltar}
        >
          Voltar aos detalhes do evento
        </Link>

        <h1>Relatório de comparecimento</h1>

        <p className={styles.descricao}>
          Acompanhe as inscrições e a presença dos participantes.
        </p>

        <section className={styles.resumo}>
          <article className={styles.card}>
            <span>Total de inscrições</span>
            <strong>{relatorio.totalInscricoes}</strong>
          </article>

          <article className={styles.card}>
            <span>Inscrições ativas</span>
            <strong>{relatorio.totalInscritos}</strong>
          </article>

          <article className={styles.card}>
            <span>Presentes</span>
            <strong className={styles.presente}>
              {relatorio.totalPresentes}
            </strong>
          </article>

          <article className={styles.card}>
            <span>Ainda não presentes</span>
            <strong>{relatorio.totalNaoPresentes}</strong>
          </article>

          <article className={styles.card}>
            <span>Lista de espera</span>
            <strong className={styles.espera}>
              {relatorio.totalListaEspera}
            </strong>
          </article>
        </section>

        <section className={styles.progresso}>
          <div className={styles.progressoCabecalho}>
            <h2>Comparecimento</h2>
            <strong>{percentual.toFixed(1)}%</strong>
          </div>

          <div
            className={styles.barraFundo}
            role="progressbar"
            aria-valuenow={percentual}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Percentual de participantes presentes"
          >
            <div
              className={styles.barraPreenchida}
              style={{ width: `${percentual}%` }}
            />
          </div>

          <p>
            {relatorio.totalPresentes} de{' '}
            {relatorio.totalInscritos} participantes ativos
            realizaram check-in.
          </p>
        </section>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../novo/page.module.css';
import {
  buscarEvento,
  type Evento,
} from '../../actions/eventos';

function formatarData(data: string) {
  const dataLocal = new Date(`${data.slice(0, 10)}T12:00:00`);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(dataLocal);
}

export default function DetalhesEvento() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarEvento() {
      if (!Number.isSafeInteger(id) || id <= 0) {
        setErro('Identificador de evento inválido.');
        setCarregando(false);
        return;
      }

      try {
        const resultado = await buscarEvento(id);

        if (!ativo) {
          return;
        }

        if (resultado.erro || !resultado.evento) {
          setErro(resultado.erro ?? 'Evento não encontrado.');
          return;
        }

        setEvento(resultado.evento);
      } catch {
        if (ativo) {
          setErro('Não foi possível carregar os detalhes do evento.');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarEvento();

    return () => {
      ativo = false;
    };
  }, [id]);

  return (
    <main className={styles.container}>
      <section className={styles.formulario}>
        <Link href="/" className={styles.linkVoltar}>
          Voltar para eventos
        </Link>

        <p className={styles.subtitulo}>DETALHES DO EVENTO</p>

        {carregando ? (
          <p>Carregando detalhes...</p>
        ) : erro ? (
          <p className={styles.erro} role="alert">
            {erro}
          </p>
        ) : evento ? (
          <>
            <h1>{evento.nome}</h1>

            <p className={styles.descricao}>
              {evento.descricao || 'Nenhuma descrição cadastrada.'}
            </p>

            <p>
              <strong>Local:</strong> {evento.local}
            </p>

            <p>
              <strong>Data:</strong> {formatarData(evento.data)}
            </p>

            <p>
              <strong>Identificador:</strong> {evento.id}
            </p>

            <Link
              href={`/eventos/${evento.id}/editar`}
              className={styles.linkVoltar}
            >
              Editar evento
            </Link>

            <Link
              href={`/eventos/${evento.id}/lotes`}
              className={styles.linkVoltar}
            >
                Gerenciar lotes
            </Link>
          </>
        ) : null}
      </section>
    </main>
  );
}
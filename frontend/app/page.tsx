'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

type Evento = {
  id: number;
  nome: string;
  descricao: string | null;
  local: string;
  data: string;
};

const API_URL = 'http://localhost:3000';

function formatarData(data: string) {
  const dataLocal = new Date(`${data.slice(0, 10)}T12:00:00`);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(dataLocal);
}

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarEventos() {
      try {
        const response = await fetch(`${API_URL}/eventos`);

        if (!response.ok) {
          throw new Error('Não foi possível carregar os eventos.');
        }

        const dados: Evento[] = await response.json();

        if (ativo) {
          setEventos(dados);
        }
      } catch (erro) {
        if (ativo) {
          setErro(
            erro instanceof Error
              ? erro.message
              : 'Erro ao carregar eventos.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarEventos();

    return () => {
      ativo = false;
    };
  }, []);

  async function excluirEvento(id: number, nome: string) {
    const confirmou = window.confirm(
      `Tem certeza de que deseja excluir o evento "${nome}"?`
    );

    if (!confirmou) {
      return;
    }

    setErro('');
    setMensagem('');

    try {
      const response = await fetch(`${API_URL}/eventos/${id}`, {
        method: 'DELETE',
      });

      const resultado = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof resultado?.message === 'string'
            ? resultado.message
            : 'Não foi possível excluir o evento.'
        );
      }

      setEventos((eventosAtuais) =>
        eventosAtuais.filter((evento) => evento.id !== id)
      );

      setMensagem(`Evento "${nome}" excluído com sucesso.`);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Erro ao excluir o evento.'
      );
    }
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.subtitulo}>GERENCIAMENTO</p>

          <h1 className={styles.titulo}>Próximos eventos</h1>

          <p className={styles.descricao}>
            Gerencie seus eventos em um só lugar.
          </p>
        </div>

        <Link href="/eventos/novo" className={styles.botaoNovo}>
          + Novo evento
        </Link>
      </header>

      {mensagem && (
        <p className={styles.mensagem} role="status">
          {mensagem}
        </p>
      )}

      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className={styles.estado}>Carregando eventos...</p>
      ) : eventos.length === 0 ? (
        <div className={styles.vazio}>
          <h2>Nenhum evento cadastrado</h2>
          <p>Comece criando seu primeiro evento.</p>

          <Link href="/eventos/novo" className={styles.botaoNovo}>
            Cadastrar evento
          </Link>
        </div>
      ) : (
        <section className={styles.lista}>
          {eventos.map((evento) => (
            <article className={styles.card} key={evento.id}>
              <span className={styles.etiqueta}>EVENTO</span>

              <h2>{evento.nome}</h2>

              <p>{evento.descricao || 'Sem descrição disponível.'}</p>

              <p>📍 {evento.local}</p>

              <p>📅 {formatarData(evento.data)}</p>

              <div className={styles.acoes}>
                <Link
                  href={`/eventos/${evento.id}/editar`}
                  className={styles.botaoEditar}
                >
                  Editar
                </Link>

                <button
                  type="button"
                  className={styles.botaoExcluir}
                  onClick={() => excluirEvento(evento.id, evento.nome)}
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
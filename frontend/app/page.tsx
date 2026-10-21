'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import {
  listarEventos,
  excluirEvento as excluirEventoServidor,
  type Evento,
} from './actions/eventos';

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
        const resultado = await listarEventos();

        if (!ativo) {
          return;
        }

        if (resultado.erro) {
          setErro(resultado.erro);
          return;
        }

        setEventos(resultado.eventos ?? []);
      } catch {
        if (ativo) {
          setErro('Não foi possível carregar os eventos.');
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
      const resultado = await excluirEventoServidor(id);

      if (resultado.erro) {
        throw new Error(resultado.erro);
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
    <div className={styles.container}>
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
                  href={`/eventos/${evento.id}`}
                  className={styles.botaoEditar}
                >
                  Ver detalhes
                </Link>

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
    </div>
  );
}
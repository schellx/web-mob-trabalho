'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../novo/page.module.css';

const API_URL = 'http://localhost:3000';

type Evento = {
  id: number;
  nome: string;
  descricao: string | null;
  local: string;
  data: string;
};

export default function EditarEvento() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarEvento() {
      try {
        const response = await fetch(`${API_URL}/eventos/${id}`);

        const resultado = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            typeof resultado?.message === 'string'
              ? resultado.message
              : 'Não foi possível encontrar o evento.'
          );
        }

        const evento: Evento = resultado;

        if (ativo) {
          setNome(evento.nome);
          setDescricao(evento.descricao ?? '');
          setLocal(evento.local);
          setData(evento.data.slice(0, 10));
        }
      } catch (erro) {
        if (ativo) {
          setErro(
            erro instanceof Error
              ? erro.message
              : 'Erro ao carregar o evento.'
          );
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

  async function salvarAlteracoes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro('');
    setSalvando(true);

    try {
      const response = await fetch(`${API_URL}/eventos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          descricao,
          local,
          data,
        }),
      });

      const resultado = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof resultado?.message === 'string'
            ? resultado.message
            : 'Não foi possível salvar as alterações.'
        );
      }

      router.push('/');
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Erro ao editar o evento.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className={styles.container}>
        <section className={styles.formulario}>
          <p>Carregando evento...</p>
        </section>
      </main>
    );
  }

  if (erro && !nome && !local && !data) {
    return (
      <main className={styles.container}>
        <section className={styles.formulario}>
          <p className={styles.erro} role="alert">
            {erro}
          </p>

          <Link href="/" className={styles.linkVoltar}>
            ← Voltar para eventos
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.formulario}>
        <Link href="/" className={styles.linkVoltar}>
          ← Voltar para eventos
        </Link>

        <p className={styles.subtitulo}>GERENCIAMENTO</p>

        <h1>Editar evento</h1>

        <p className={styles.descricao}>
          Altere os dados do evento e salve as modificações.
        </p>

        <form onSubmit={salvarAlteracoes}>
          <label htmlFor="nome">Nome do evento</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />

          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            rows={3}
          />

          <label htmlFor="local">Local</label>
          <input
            id="local"
            type="text"
            value={local}
            onChange={(event) => setLocal(event.target.value)}
            required
          />

          <label htmlFor="data">Data do evento</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(event) => setData(event.target.value)}
            required
          />

          {erro && (
            <p className={styles.erro} role="alert">
              {erro}
            </p>
          )}

          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </section>
    </main>
  );
}
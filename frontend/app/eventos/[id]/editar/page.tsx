'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../novo/page.module.css';
import {
  buscarEvento,
  atualizarEvento,
} from '../../../actions/eventos';

export default function EditarEvento() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
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

        const evento = resultado.evento;

        setNome(evento.nome);
        setDescricao(evento.descricao ?? '');
        setLocal(evento.local);
        setData(evento.data.slice(0, 10));
      } catch {
        if (ativo) {
          setErro('Não foi possível carregar o evento.');
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

  async function salvarAlteracoes(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro('');
    setSalvando(true);

    try {
      const resultado = await atualizarEvento(id, {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        local: local.trim(),
        data,
      });

      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setErro('Não foi possível salvar as alterações.');
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
            Voltar para eventos
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.formulario}>
        <Link href="/" className={styles.linkVoltar}>
          Voltar para eventos
        </Link>

        <p className={styles.subtitulo}>GERENCIAMENTO</p>

        <h1>Editar evento</h1>

        <p className={styles.descricao}>
          Altere os dados do evento abaixo.
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
'use client';

import { useState, type FormEvent } from 'react';
import styles from './page.module.css';

export default function NovoEvento() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrarEvento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3000/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          descricao,
          local,
          data,
          organizadorId: 1,
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof resultado.message === 'string'
            ? resultado.message
            : 'Não foi possível cadastrar o evento.'
        );
      }

      setMensagem('Evento cadastrado com sucesso!');

      setNome('');
      setDescricao('');
      setLocal('');
      setData('');
    } catch (erro) {
      setMensagem(
        erro instanceof Error
          ? erro.message
          : 'Erro ao cadastrar evento.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.container}>
      <section className={styles.formulario}>
        <p className={styles.subtitulo}>GERENCIAMENTO</p>

        <h1>Novo evento</h1>

        <p className={styles.descricao}>
          Preencha os dados abaixo para cadastrar um evento.
        </p>

        <form onSubmit={cadastrarEvento}>
          <label htmlFor="nome">Nome do evento</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Apresentação Musical"
            required
          />

          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Conte um pouco sobre o evento"
            rows={3}
          />

          <label htmlFor="local">Local</label>
          <input
            id="local"
            type="text"
            value={local}
            onChange={(event) => setLocal(event.target.value)}
            placeholder="Arena do Grêmio"
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

          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar evento'}
          </button>

          {mensagem && (
            <p className={styles.mensagem} role="status">
              {mensagem}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
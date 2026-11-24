'use client';

import { useState, type FormEvent } from 'react';

import {
  cadastrarRecepcionista,
} from '../actions/recepcionistas';

import type {
  Recepcionista,
} from '../actions/recepcionistas';

import styles from './page.module.css';

export default function GerenciarRecepcionistas() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [recepcionistaCriado, setRecepcionistaCriado] =
    useState<Recepcionista | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro('');
    setMensagem('');
    setRecepcionistaCriado(null);

    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setSalvando(true);

    try {
      const resultado = await cadastrarRecepcionista({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      if (resultado.erro || !resultado.recepcionista) {
        setErro(
          resultado.erro ??
            'Não foi possível cadastrar o recepcionista.',
        );
        return;
      }

      setRecepcionistaCriado(resultado.recepcionista);

      setMensagem('Recepcionista cadastrado com sucesso!');

      setNome('');
      setEmail('');
      setSenha('');
    } catch {
      setErro('Ocorreu um erro ao cadastrar o recepcionista.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.cabecalho}>
        <h2>Cadastrar recepcionista</h2>

        <p>
          Cadastre usuários que poderão realizar o
          credenciamento e o check-in dos eventos.
        </p>
      </div>

      {erro && (
        <div className={styles.erro} role="alert">
          {erro}
        </div>
      )}

      {mensagem && (
        <div className={styles.sucesso} role="status">
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.campo}>
          <label htmlFor="nome">Nome completo</label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Nome do recepcionista"
            autoComplete="name"
            required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="recepcionista@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="senha">Senha</label>

          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Mínimo de 6 caracteres"
            minLength={6}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={salvando}
          className={styles.botao}
        >
          {salvando
            ? 'Cadastrando...'
            : 'Cadastrar recepcionista'}
        </button>
      </form>

      {recepcionistaCriado && (
        <div className={styles.resultado}>
          <h3>Dados do recepcionista</h3>

          <p>
            <strong>ID:</strong> {recepcionistaCriado.id}
          </p>

          <p>
            <strong>Nome:</strong> {recepcionistaCriado.nome}
          </p>

          <p>
            <strong>E-mail:</strong> {recepcionistaCriado.email}
          </p>

          <p>
            <strong>Perfil:</strong> RECEPCIONISTA
          </p>
        </div>
      )}
    </section>
  );
}
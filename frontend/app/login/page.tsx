'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions/auth';
import styles from './page.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const [estado, formAction, carregando] = useActionState(
    loginAction,
    {}
  );

  return (
    <section className={styles.container}>
      <div className={styles.cartao}>
        <p className={styles.subtitulo}>ACESSO AO SISTEMA</p>

        <h2>Entrar no EvenToon</h2>

        <p className={styles.descricao}>
          Informe suas credenciais para gerenciar os eventos.
        </p>

        <form action={formAction} className={styles.formulario}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="organizador@exemplo.com"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
          />

          {estado.erro && (
            <p className={styles.erro} role="alert">
              {estado.erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className={styles.botao}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={styles.rodape}>
          <Link href="/cadastro">Criar conta</Link>
        </p>
      </div>
    </section>
  );
}
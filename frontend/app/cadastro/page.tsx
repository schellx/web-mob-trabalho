'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { cadastroAction } from '../actions/auth';
import styles from './page.module.css';

export default function CadastroPage() {
  const [estado, formAction, carregando] = useActionState(
    cadastroAction,
    {}
  );

  return (
    <section className={styles.container}>
      <div className={styles.cartao}>
        <p className={styles.subtitulo}>CRIE SUA CONTA</p>

        <h2>Cadastre-se no EvenToon</h2>

        <p className={styles.descricao}>
          Preencha seus dados para começar a usar o sistema.
        </p>

        <form action={formAction} className={styles.formulario}>
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            placeholder="Digite seu nome completo"
            minLength={2}
            maxLength={100}
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seuemail@exemplo.com"
            maxLength={254}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            minLength={8}
            maxLength={128}
            required
          />

          {estado.erro && (
            <p className={styles.erro} role="alert">
              {estado.erro}
            </p>
          )}

          {estado.sucesso && (
            <p className={styles.sucesso} role="status">
              {estado.sucesso}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className={styles.botao}
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className={styles.rodape}>
          Já possui uma conta?{' '}
          <Link href="/login">Entrar</Link>
        </p>
      </div>
    </section>
  );
}
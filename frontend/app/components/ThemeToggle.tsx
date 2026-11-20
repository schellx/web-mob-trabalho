'use client';

import { useEffect, useState } from 'react';

type Tema = 'light' | 'dark';

export default function ThemeToggle() {
  const [tema, setTema] = useState<Tema>('light');

  useEffect(() => {
    const temaSalvo = localStorage.getItem('eventoon-theme');

    const temaInicial: Tema =
      temaSalvo === 'dark' ? 'dark' : 'light';

    document.documentElement.dataset.theme = temaInicial;
    setTema(temaInicial);
  }, []);

  function alternarTema() {
    const novoTema: Tema = tema === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = novoTema;
    localStorage.setItem('eventoon-theme', novoTema);
    setTema(novoTema);
  }

  return (
    <button
      type="button"
      className="botao-tema"
      onClick={alternarTema}
      aria-label={
        tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'
      }
      title={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      <span aria-hidden="true">
        {tema === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
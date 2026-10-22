import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { logoutAction } from './actions/auth';
import './globals.css';
import Image from 'next/image';
import ThemeToggle from './components/ThemeToggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EvenToon | Shows e muito mais',
};

export default async function RootLayout({
  children,
}: LayoutProps<'/'>) {
  const armazenamento = await cookies();
  const autenticado = Boolean(armazenamento.get('token')?.value);

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="cabecalho">
          <div className="faixa">
            <div className="vermelho"></div>
            <div className="amarelo"></div>
            <div className="azul"></div>
          </div>

          <div className="conteudo-cabecalho">
           <Image
            src="/icone.png"
            alt="Logo do sistema"
            width={48}
            height={48}
           className="logo"
           />

            <div>
              <h1>Sistema de Eventos</h1>
              <p>Gestão de eventos e inscrições</p>
            </div>

            <div className="acoes-cabecalho">
                <ThemeToggle />

                {autenticado && (
                  <form action={logoutAction} className="formulario-sair">
                    <button type="submit" className="botao-sair">
                      Sair
                    </button>
                  </form>
                )}
              </div>
            
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EvenToon | Shows e muito mais",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
 <html lang="pt-BR">
      <body>
        <header className="cabecalho">

          <div className="faixa">
            <div className="vermelho"></div>
            <div className="amarelo"></div>
            <div className="azul"></div>
          </div>

          <div className="conteudo-cabecalho">
            <img
              src="/icone.png"
              alt="Logo do sistema"
              className="logo"
            />

            <div>
              <h1>Sistema de Eventos</h1>
              <p>Gestão de eventos e inscrições</p>
            </div>
          </div>

        </header>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
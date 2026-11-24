import { notFound } from 'next/navigation';

import { buscarEvento } from '../../../actions/eventos';
import GerenciarInscricoes from './gerenciar-inscricoes-client';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaginaInscricoes({ params }: Props) {
  const { id } = await params;
  const eventoId = Number(id);

  if (!Number.isSafeInteger(eventoId) || eventoId <= 0) {
    notFound();
  }

  const resultado = await buscarEvento(eventoId);

  if (!resultado.evento) {
    if (resultado.erro?.includes('conectar')) {
      return <p>{resultado.erro}</p>;
    }

    notFound();
  }

  return <GerenciarInscricoes eventoId={eventoId} />;
}
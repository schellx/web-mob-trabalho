import { notFound } from 'next/navigation';

import { buscarEvento } from '../../../actions/eventos';
import GerenciarLotes from './gerenciar-lotes-client';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaginaLotes({ params }: Props) {
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

  return <GerenciarLotes eventoId={eventoId} />;
}